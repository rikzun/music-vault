import './Button.style.scss'
import { MouseEvent } from 'react'
import QueueMusicIcon from "@assets/QueueMusic.svg"
import PeopleAltIcon from "@assets/PeopleAlt.svg"
import ForumIcon from "@assets/Forum.svg"
import SearchIcon from "@assets/Search.svg"
import DownloadIcon from "@assets/Download.svg"

export interface ButtonPropsMenu {
    ariaLabel: string
    icon: ButtonIcon
    isPressed: boolean
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface ButtonPropsText {
    value: string
    className?: string
    onClick: (e: MouseEvent<HTMLSpanElement>) => void
}

type ButtonIcon =
    | 'QueueMusic'
    | 'PeopleAlt'
    | 'Forum'
    | 'Search'
    | 'Download'

type ButtonVariant =
    | 'menu'

export namespace Button {
    export function Menu(props: ButtonPropsMenu) { return component1('menu', props) }
    export function Text(props: ButtonPropsText) { return component2(props) }

    function component1(variant: ButtonVariant, props: ButtonPropsMenu) {
        let className = 'button-component'
        let icon = null

        if (props.isPressed) className += ' button-component__active'
        if (variant == 'menu') className += ' button-menu'

        if (props.icon == 'QueueMusic') icon = <QueueMusicIcon />
        else if (props.icon == 'PeopleAlt') icon = <PeopleAltIcon />
        else if (props.icon == 'Forum') icon = <ForumIcon />
        else if (props.icon == 'Search') icon = <SearchIcon />
        else if (props.icon == 'Download') icon = <DownloadIcon />

        return (
            <button
                aria-label={props.ariaLabel}
                aria-pressed={props.isPressed}
                className={className}
                onClick={props.onClick}
            >
                <div className="content">
                    {icon}
                </div>
            </button>
        )
    }

    function component2(props: ButtonPropsText) {
        let className = 'button-component button-text'
        if (props.className) className += ' ' + props.className

        return (
            <button
                className={className}
                onClick={props.onClick}
                children={props.value}
            />
        )
    }
}