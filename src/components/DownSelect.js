import React, { useState } from 'react'
import { useCombobox } from 'downshift'

const menuStyles = {
	backgroundColor: 'white',
	highlightedIndex: '#F2F2F2',
	fontWeight: 'normal',
	position: 'absolute'
}

const DropdownCombobox = props => {
	const {
		inputRef,
		inputPlaceholder,
		onKeyDown,
		handleValueChange,
		options,
		validationFn,
		inputValue,
		expressionInputClass = '',
		typeMap
	} = props
	const [inputItems, setInputItems] = useState(options)
	const [hasFocus, setHasFocus] = useState(false)
	const [valid, setValid] = useState(true)
	const [valueType, setValueType] = useState('string')

	const stateReducer = (state, actionAndChanges) => {
		// this prevents the menu from being closed when the user selects an item with 'Enter' or mouse
		// console.log(state, actionAndChanges)
		const { stateChangeTypes } = useCombobox
		switch (actionAndChanges.type) {
			case stateChangeTypes.InputChange:
				if (validationFn) {
					validationFn(actionAndChanges.changes.inputValue)
						? setValid(true)
						: setValid(false)
				}
				return {
					// return normal changes.
					...actionAndChanges.changes,
					// but taking the change from default reducer and uppercasing it.
					inputValue: actionAndChanges.changes.inputValue
				}
			// also on selection.
			case stateChangeTypes.ItemClick:
			case stateChangeTypes.InputKeyDownEnter:
				// case useCombobox.stateChangeTypes.InputBlur:
				handleValueChange({
					target: {
						value:
							state.highlightedIndex > -1
								? actionAndChanges.changes.selectedItem.label
								: actionAndChanges.changes.inputValue || ''
					}
				})
				return {
					...actionAndChanges.changes,
					// if we had an item highlighted in the previous state.
					...(state.highlightedIndex > -1 && {
						inputValue: actionAndChanges.changes.selectedItem.label
					})
				}
			case useCombobox.stateChangeTypes.InputBlur:
				setHasFocus(false)
				return {
					action: actionAndChanges.changes
				}
			default:
				return actionAndChanges.changes // otherwise business as usual.
		}
	}

	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		getComboboxProps,
		highlightedIndex,
		getItemProps
	} = useCombobox({
		items: inputItems,
		defaultIsOpen: true,
		initialIsOpen: true,
		initialHighlightedIndex: 0,
		onInputValueChange: ({ inputValue }) => {
			setInputItems(
				options.filter(item => {
					return item.key.includes(inputValue.toLowerCase())
				})
			)
			// check if the input value is present in any of the option
			const formattedInputValue = inputValue.trim().toLowerCase()
			const isPresentInOptions = options.find(
				option => option.key === formattedInputValue
			)
			if (isPresentInOptions) {
				setValueType(isPresentInOptions.type)
			} else {
				setValueType('string') // can also use typeof formattedInputValue but it will result in string anyways
			}
		},
		stateReducer
	})
	return (
		<>
			{/* <label {...getLabelProps()}>Choose an element:</label> */}
			<div
				style={{ display: 'inline-block' }}
				data-type="expression-input-root"
				{...getComboboxProps()}
				className={expressionInputClass}
			>
				<input
					{...getInputProps({
						onChange: handleValueChange,
						onKeyDown: onKeyDown,
						value: inputValue,
						ref: inputRef,
						placeholder: inputPlaceholder,
						onFocus: () => setHasFocus(true)
					})}
					data-valid={valid}
					data-value-type={valueType}
				/>
				{hasFocus && inputItems.length > 0 && (
					<ul
						data-type="expression-list"
						{...getMenuProps()}
						style={menuStyles}
					>
						{inputItems.map((item, index) => (
							<li
								style={
									highlightedIndex === index
										? { backgroundColor: '#F2F2F2' }
										: {}
								}
								data-type="expression-list-item"
								key={`${item.key}${index}`}
								{...getItemProps({ item, index })}
							>
								<span>{item.label}</span>
								{typeMap && <span> {typeMap[item.type]}</span>}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	)
}

export default DropdownCombobox
