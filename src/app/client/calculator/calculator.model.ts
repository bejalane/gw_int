export class Job {
    constructor(
        public name: string,
        public need: boolean,
        public id: number,
        public from: number,
        public to: number,
        public note: string,
        public images: any[],
        public noteExpanded: boolean,
        public children: any[],
        public budgetPerGuest: boolean,
        public budgetMin: number,
        public budgetMax: number,
        public order: number,
        public parent: any,
        public defaultShow: boolean,
        public hasChildren: boolean,
        public category: string,
        public perGuest: boolean
    ){}
}

export class SaveJob {
    constructor(
        public service: number,
        public budgetFrom: number,
        public budgetTo: number,
        public note: string,
        public images: any[]
    ){}
}

export class SaveCustomJob {
    constructor(
        public service: number,
        public budgetFrom: number,
        public budgetTo: number,
        public note: string,
        public images: any[],
        public chosenProvider: string,
        public priceOffer: number
    ){}
}

export class Calculator {
    constructor(
        public planName: string,
        public area: number,
        public guests: number,
        public date: string,
        public aboutUs: string,
        public jobs: {}[]
    ){}
}