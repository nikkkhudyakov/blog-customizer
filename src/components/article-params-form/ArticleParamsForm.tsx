import clsx from 'clsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onApply: (newState: ArticleStateType) => void;
	onReset: () => void;
	defaultState: ArticleStateType;
};

export const ArticleParamsForm = ({
	articleState,
	onApply,
	onReset,
	defaultState,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [draftState, setDraftState] = useState(articleState);
	const asideRef = useRef<HTMLElement>(null);

	useEffect(() => {
		setDraftState(articleState);
	}, [articleState]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target;

			if (target instanceof Node && !asideRef.current?.contains(target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onApply(draftState);
	};

	const handleReset = () => {
		setDraftState(defaultState);
		onReset();
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Select
						title='Шрифт'
						selected={draftState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) =>
							setDraftState((state) => ({ ...state, fontFamilyOption: option }))
						}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={draftState.fontSizeOption}
						onChange={(option) =>
							setDraftState((state) => ({ ...state, fontSizeOption: option }))
						}
					/>
					<Select
						title='Цвет шрифта'
						selected={draftState.fontColor}
						options={fontColors}
						onChange={(option) =>
							setDraftState((state) => ({ ...state, fontColor: option }))
						}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={draftState.backgroundColor}
						options={backgroundColors}
						onChange={(option) =>
							setDraftState((state) => ({ ...state, backgroundColor: option }))
						}
					/>
					<Select
						title='Ширина контента'
						selected={draftState.contentWidth}
						options={contentWidthArr}
						onChange={(option) =>
							setDraftState((state) => ({ ...state, contentWidth: option }))
						}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
