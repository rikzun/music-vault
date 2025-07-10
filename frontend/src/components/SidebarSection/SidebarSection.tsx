import './SidebarSection.style.scss'
import { UserPanel } from '@components/UserPanel'
import { Button } from '@components/Button'
import { useState } from '@utils/hooks'
import { SidebarUpload } from '@components/SidebarUpload'
import { MdQueueMusic, MdPeopleAlt, MdForum, MdSearch, MdDownload } from "react-icons/md"

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
                            aria-label="QueueMusic"
                            icon={MdQueueMusic}
                            isPressed={menu.value == 'Playlists'}
                            onClick={() => menu.set('Playlists')}
                        />

                        <Button.Menu
                            aria-label="PeopleAlt"
                            icon={MdPeopleAlt}
                            isPressed={menu.value == 'Friends'}
                            onClick={() => menu.set('Friends')}
                        />

                        <Button.Menu
                            aria-label="Forum"
                            icon={MdForum}
                            isPressed={menu.value == 'RoomChat'}
                            onClick={() => menu.set('RoomChat')}
                        />

                        <Button.Menu
                            aria-label="Search"
                            icon={MdSearch}
                            isPressed={menu.value == 'Search'}
                            onClick={() => menu.set('Search')}
                        />
                    </div>

                    <div className="bottom">
                        <Button.Menu
                            aria-label="Download"
                            icon={MdDownload}
                            isPressed={menu.value == 'Upload'}
                            onClick={() => menu.set('Upload')}
                        />
                    </div>
                </div>

                {menu.value == 'Upload' && <SidebarUpload />}
            </div>

            <UserPanel />
        </div>
    )
}