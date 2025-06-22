import './SidebarSection.style.scss'
import { UserPanel } from '@components/UserPanel'
import { Button } from '@components/Button'
import { useState } from '@utils/hooks'

type MenuItems =
    | 'Playlists'
    | 'Friends'
    | 'RoomChat'
    | 'Search'
    | 'Upload'

export function SidebarSection() {
    const menu = useState<MenuItems>('Playlists')

    return (
        <div className="sidebar-section">
            <div className="container">
                <div className="buttons">
                    <div className="top">
                        <Button.Menu
                            ariaLabel="QueueMusic"
                            icon="QueueMusic"
                            isPressed={menu.value == 'Playlists'}
                            onClick={() => menu.set('Playlists')}
                        />

                        <Button.Menu
                            ariaLabel="PeopleAlt"
                            icon="PeopleAlt"
                            isPressed={menu.value == 'Friends'}
                            onClick={() => menu.set('Friends')}
                        />

                        <Button.Menu
                            ariaLabel="Forum"
                            icon="Forum"
                            isPressed={menu.value == 'RoomChat'}
                            onClick={() => menu.set('RoomChat')}
                        />

                        <Button.Menu
                            ariaLabel="Search"
                            icon="Search"
                            isPressed={menu.value == 'Search'}
                            onClick={() => menu.set('Search')}
                        />
                    </div>

                    <div className="bottom">
                        <Button.Menu
                            ariaLabel="Download"
                            icon="Download"
                            isPressed={menu.value == 'Upload'}
                            onClick={() => menu.set('Upload')}
                        />
                    </div>
                </div>

                <div className="content">
                    <div className="title">
                        {menu.value}
                    </div>
                </div>
            </div>

            <UserPanel />
        </div>
    )
}