function Columns(element, {gridLines = true, colClass = 'col', breakpointMd = 768, breakpointLg = 1200} = {}) {
    let windowWidth = window.innerWidth;
    let oneColWidth = element.clientWidth / 12;

    function initColumn(el) {
        let resizer;
        let dragging = false
        let x = 0;

        function onMouseDown(event) {
            x = event.x;
            dragging = true
            element.classList.add('dragging')
            resizer.classList.add('dragging')
        }

        function onMouseMove(event) {
            if(dragging) {
                let field = 'cols'

                if(windowWidth > breakpointLg) {
                    field = 'colsLg'
                } else if(windowWidth > breakpointMd) {
                    field = 'colsMd'
                }
                console.log(el.dataset[field], breakpointLg, breakpointMd, windowWidth, field)

                if(event.x - x < -oneColWidth / 2) {
                    el.dataset[field] = +(el.dataset[field]) - 1
                    x = x - oneColWidth
                }
                if(event.x - x > oneColWidth / 2) {
                    el.dataset[field] = +(el.dataset[field]) + 1
                    x = x + oneColWidth
                }
            }
        }

        function onMouseUp(event) {
            resizer.style.right = '-8px'
            dragging = false

            element.classList.remove('dragging')
            resizer.classList.remove('dragging')
        }

        function init() {
            resizer = document.createElement('div')
            resizer.classList.add('resizer-handle')
            el.appendChild(resizer)

            resizer.addEventListener('mousedown', onMouseDown)
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        }

        function destroy() {
            resizer.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            resizer.remove()
        }

        init()
        return { init, destroy }
    }

    let columns = []

    function onWindowResize(event) {
        windowWidth = window.innerWidth;
        oneColWidth = element.clientWidth / 12
    }

    function init() {
        if(gridLines) {
            for(let i=0; i<12; i++) {
                const line = document.createElement('div')
                line.classList.add('line')
                line.style.left = (oneColWidth * i) + 'px'

                element.appendChild(line)
            }
        }
        element.dataset.columns = ''
        element.classList.add('active')

        console.log(element)
        element.querySelectorAll('.' + colClass).forEach(el => {
            columns.push(initColumn(el))
        })  
        window.addEventListener('resize', onWindowResize)
    }

    function destroy() {
        element.classList.remove('active')
        if(gridLines) {
            element.querySelectorAll('.line').forEach(el => el.remove())
        }
        columns.map(column => column.destroy())
        columns = []
        window.removeEventListener('resize', onWindowResize)

    }

    function append({cols, colsMd, colsLg, content}) {
        var column = document.createElement('div')
        column.classList.add(colClass)
        column.dataset.cols = cols
        column.dataset.colsMd = colsMd
        column.dataset.colsLg = colsLg
        column.innerHTML = content

        element.appendChild(column)
        setTimeout(() => {
            columns.push(initColumn(column))
        })
    }

    return {
        init, destroy, append
    }
}

window.Columns = Columns