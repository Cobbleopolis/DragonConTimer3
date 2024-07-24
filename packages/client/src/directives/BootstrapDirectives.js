import { Tooltip, Popover } from 'bootstrap'

const tooltip = {
    mounted(el) {
        const tooltip = new Tooltip(el)
    }
}

const popover = {
    mounted(el) {
        const popover = new Popover(el)
    }
}

export default {
    tooltip,
    popover
}