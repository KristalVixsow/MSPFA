import validate from './index.validate';
import type { APIHandler } from 'lib/server/api';
import type { ServerColorGroup } from 'lib/server/colors';
import { getClientColorGroup } from 'lib/server/colors';
import stories, { getStoryByUnsafeID } from 'lib/server/stories';
import { authenticate } from 'lib/server/auth';
import type { ClientColorGroup } from 'lib/client/colors';
import { Perm } from 'lib/client/perms';
import StoryPrivacy from 'lib/client/StoryPrivacy';
import { flatten } from 'lib/server/db';

/** The keys of all `ClientColorGroup` properties which a client should be able to `PATCH` into a `ServerColorGroup`. */
type WritableColorGroupKey = 'name';

const Handler: APIHandler<{
	query: {
		storyID: string,
		colorGroupID: string
	}
} & (
	{
		method: 'GET'
	} | {
		method: 'DELETE'
	} | {
		method: 'PATCH',
		body: Partial<Pick<ClientColorGroup, WritableColorGroupKey>>
	}
), {
	method: 'GET',
	body: ClientColorGroup
} | {
	method: 'DELETE'
} | {
	method: 'PATCH',
	body: ClientColorGroup
}> = async (req, res) => {
	await validate(req, res);

	const story = await getStoryByUnsafeID(req.query.storyID, res);

	/** Gets the requested color group. If the color group doesn't exist, responds with an error and never resolves. */
	const getColorGroup = () => new Promise<ServerColorGroup>(resolve => {
		const colorGroup = story.colorGroups.find(({ id }) => id.toString() === req.query.colorGroupID);

		if (!colorGroup) {
			res.status(404).send({
				message: 'No color group was found with the specified ID.'
			});
			return;
		}

		resolve(colorGroup);
	});

	if (req.method === 'GET') {
		if (story.privacy === StoryPrivacy.Private) {
			const { user } = await authenticate(req, res);

			if (!(
				user && (
					story.owner.equals(user._id)
					|| story.editors.some(userID => userID.equals(user._id))
					|| user.perms & Perm.sudoRead
				)
			)) {
				res.status(403).send({
					message: 'You do not have permission to access the specified adventure.'
				});
				return;
			}
		}

		res.send(getClientColorGroup(await getColorGroup()));
		return;
	}

	const { user } = await authenticate(req, res);

	if (req.method === 'DELETE') {
		if (!(
			user && (
				story.owner.equals(user._id)
				|| story.editors.some(userID => userID.equals(user._id))
				|| user.perms & Perm.sudoDelete
			)
		)) {
			res.status(403).send({
				message: 'You do not have permission to delete color groups on the specified adventure.'
			});
			return;
		}

		await stories.updateOne({
			_id: story._id
		}, {
			$pull: {
				colorGroups: {
					id: (await getColorGroup()).id
				}
			}
		});

		res.status(204).end();
		return;
	}

	// If this point is reached, `req.method === 'PATCH'`.

	if (!(
		user && (
			story.owner.equals(user._id)
			|| story.editors.some(userID => userID.equals(user._id))
			|| user.perms & Perm.sudoWrite
		)
	)) {
		res.status(403).send({
			message: 'You do not have permission to edit color groups on the specified adventure.'
		});
		return;
	}

	const colorGroup = await getColorGroup();

	Object.assign(colorGroup, req.body);

	if (Object.values(req.body).length) {
		await stories.updateOne({
			'_id': story._id,
			'colorGroups.id': colorGroup.id
		}, {
			$set: flatten(req.body, 'colorGroups.$.')
		});
	}

	res.send(getClientColorGroup(colorGroup));
};

export default Handler;