export class WindowContent {
    public title: string = '';
    public icon: string = '';
    constructor(title: string, icon?: string) {
        this.title = title;
        this.icon = icon || '';
    }
}