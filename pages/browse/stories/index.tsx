import './styles.module.scss';
import { withStatusCode } from 'lib/server/errors';
import type { PublicStory } from 'lib/client/stories';
import { connection } from 'lib/server/db';
import Label from 'components/Label';
import { Field } from 'formik';
import Row from 'components/Row';
import { useRouter } from 'next/router';
import type { integer } from 'lib/types';
import BrowsePage, { getBooleanRecordFromQueryValue, getTagsFromQueryValue, MAX_RESULTS_PER_PAGE } from 'components/BrowsePage';
import StoryListing from 'components/StoryListing';
import TagField from 'components/TagField';
import Columns from 'components/Columns';
import type StoryStatus from 'lib/client/StoryStatus';
import { storyStatusNames } from 'lib/client/StoryStatus';
import type { ReactNode } from 'react';

type ServerSideProps = {
	stories?: never,
	resultCount?: never
} | {
	stories: PublicStory[],
	resultCount: integer
};

const Component = ({ stories, resultCount }: ServerSideProps) => {
	const router = useRouter();

	/** A record which maps every `StoryStatus` to `true`. */
	const allStatusesTrue: Record<string, true> = {} as any;

	const statusFieldContainers: ReactNode[] = [];

	for (const status of Object.keys(storyStatusNames)) {
		allStatusesTrue[status] = true;

		statusFieldContainers.push(
			<span
				key={status}
				className="browse-stories-field-container-status"
			>
				<Field
					type="checkbox"
					id={`field-status-${status}`}
					name={`status.${status}`}
					className="spaced"
				/>
				<label
					className="spaced"
					htmlFor={`field-status-${status}`}
				>
					{storyStatusNames[status as unknown as StoryStatus]}
				</label>
			</span>
		);
	}

	return (
		<BrowsePage
			resourceLabel="Adventures"
			initialValues={{
				title: (
					typeof router.query.title === 'string'
						? router.query.title
						: ''
				),
				tags: getTagsFromQueryValue(router.query.tags),
				excludeTags: getTagsFromQueryValue(router.query.excludeTags, ['test']),
				status: getBooleanRecordFromQueryValue(router.query.status, allStatusesTrue)
			}}
			listing={StoryListing}
			resultCount={resultCount}
			results={stories}
		>
			<Row>
				<Label className="spaced" htmlFor="field-title">
					Title
				</Label>
				<Field
					id="field-title"
					name="title"
					className="spaced"
					maxLength={50}
					autoFocus
				/>
			</Row>
			<Row>
				<Label className="spaced">
					Status
				</Label>
				{statusFieldContainers}
			</Row>
			<Columns>
				<TagField
					label="Tags"
					help="An adventure that has all of these tags will be included in the search results (given it also matches other search parameters)."
				/>
				<TagField
					name="excludeTags"
					label="Exclude Tags"
					help="An adventure that has any of these tags will be excluded from the search results, even if it matches other search parameters."
				/>
			</Columns>
		</BrowsePage>
	);
};

export default Component;

export const getServerSideProps = withStatusCode<ServerSideProps>(async ({ query }) => {
	await connection;

	const results = ( // TODO
		typeof query.title === 'string'
			? []
			: undefined
	);

	let props;

	if (results) {
		let pageNumber = typeof query.p === 'string' ? +query.p : 1;

		if (Number.isNaN(pageNumber) || pageNumber < 1) {
			pageNumber = 1;
		}

		const startIndex = (pageNumber - 1) * MAX_RESULTS_PER_PAGE;

		props = {
			stories: results.slice(startIndex, startIndex + MAX_RESULTS_PER_PAGE),
			resultCount: results.length
		};
	} else {
		props = {};
	}

	return { props };
});