export type OnDimensionResizeCallback =
    (dimension: [width: number, height: number]) => void;

export default class Dimension {
    public width: number;
    public height: number;

    public listeners: Set<OnDimensionResizeCallback> = new Set();

    private handleResize = () => {
        this.width = window.innerWidth + 1;
        this.height = window.innerHeight + 1;

        for (const listener of this.listeners) {
            listener([this.width, this.height]);
        }
    }

    constructor() {
        this.width = window.innerWidth + 1;
        this.height = window.innerHeight + 1;

        window.addEventListener('resize', this.handleResize);
    }

    public get aspectRatio() {
        return this.width / this.height;
    }

    onResize(callback: OnDimensionResizeCallback) {
        this.listeners.add(callback);
    }

    removeResizeHandler(callback: OnDimensionResizeCallback) {
        if (this.listeners.has(callback)) {
            this.listeners.delete(callback);
        }
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
    }
}