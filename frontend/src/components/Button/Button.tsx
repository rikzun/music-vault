import './Button.style.scss'
import { SyntheticEvent } from 'react'
import QueueMusicIcon from "@assets/QueueMusic.svg"
import PeopleAltIcon from "@assets/PeopleAlt.svg"
import ForumIcon from "@assets/Forum.svg"
import SearchIcon from "@assets/Search.svg"
import DownloadIcon from "@assets/Download.svg"

export interface ButtonProps {
    ariaLabel: string
    icon: ButtonIcon
    isPressed: boolean
    onClick: (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => void
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
    export function Menu(props: ButtonProps) { return component('menu', props) }

    function component(variant: ButtonVariant, props: ButtonProps) {
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
}