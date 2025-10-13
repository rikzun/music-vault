export function TouchMenu() {
    return (
        <div
            className="contextmenu-component contextmenu-component__touch"
            onContextMenu={(e) => {
                e.stopPropagation()
                e.preventDefault()
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <div>option 1</div>
            <div>option 2</div>
            <div>option 3</div>
            <div>option 4</div>
        </div>
    )
}