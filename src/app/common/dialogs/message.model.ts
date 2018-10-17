export class Message {
    class: string;
    created_at: string;
    constructor(
        public user2Username: string,
        public text: string,
        public data: MessageData,
    ){
        this.class = 'right';
    }
}

export class MessageData {
    constructor(
        public images: any[]
    ){}
}