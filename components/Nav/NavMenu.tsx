import NavItem from 'components/Nav/NavItem';
import type { NavItemProps } from 'components/Nav/NavItem';
import React, { useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';

export type NavMenuProps = {
	onFocus?: never,
	onBlur?: never,
	onClick?: never,
	/** The nav items in this nav menu. */
	children: JSX.Element | JSX.Element[]
} & Omit<NavItemProps, 'href' | 'children'>;

const NavMenu = ({ id, children, ...props }: NavMenuProps) => {
	// This state is whether the menu's label is in focus due to being clicked.
	const [clickedLabel, setClickedLabel] = useState(false);

	// This state is whether the menu container should have the `force-open` class, which forces it to be visible.
	// Note: The menu can still be open without the `force-open` class, for example if it or its label is hovered over.
	const [forceOpen, setForceOpen] = useState(false);

	/** A ref to the underlying link element of this menu's label. */
	const labelRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null!);
	const menuContainerRef = useRef<HTMLDivElement>(null!);

	/** Handles the focus event on the menu's label or any link in the menu. */
	const onFocus = useCallback(() => {
		// When the menu's label or any link in the menu is focused, add the `force-open` class to the menu container.
		setForceOpen(true);
	}, []);

	/** Handles the blur event on the menu's label or any link in the menu. */
	const onBlur = useCallback(() => {
		// `setTimeout` is necessary here because otherwise, for example when tabbing through links in the menu, this will run before the next link in the menu focuses, so the `if` statement would not detect that the menu is in focus.
		setTimeout(() => {
			if (
				document.activeElement !== labelRef.current
				&& !menuContainerRef.current.contains(document.activeElement)
			) {
				// If no part of the menu is in focus, remove the `force-open` class.
				setForceOpen(false);
			}
		});
	}, []);

	const addMenuChildKey = (child: JSX.Element, index: number) => (
		React.cloneElement(child, {
			key: child.props.id || index
		})
	);

	return (
		<div
			id={`nav-menu-container-${id}`}
			className={`nav-menu-container${forceOpen ? ' force-open' : ''}`}
			onFocus={onFocus}
			onBlur={onBlur}
			ref={menuContainerRef}
		>
			{/* The menu's label. */}
			<NavItem
				id={id}
				{...props}
				onBlur={
					useCallback(() => {
						// When the menu's label is blurred, it is (obviously) no longer focused from being clicked.
						setClickedLabel(false);
					}, [])
				}
				onClick={
					useCallback((event: MouseEvent) => {
						event.preventDefault();

						if (clickedLabel) {
							// If the label is already clicked and the user clicks it again, it should toggle its focus off, allowing the menu to be hidden.
							labelRef.current.blur();
						}

						// When the user clicks the label, toggle whether it is clicked.
						setClickedLabel(!clickedLabel);
					}, [clickedLabel])
				}
				ref={labelRef}
			/>
			<div
				id={`nav-menu-${id}`}
				className="nav-menu"
			>
				{Array.isArray(children) ? children.map(addMenuChildKey) : addMenuChildKey(children, 0)}
			</div>
		</div>
	);
};

export default NavMenu;