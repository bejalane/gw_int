class Answer {
    constructor(
        public id: any,
        public answer_text: string,
        public is_right: boolean
    ){}
}

export class Question {
    constructor(
        public id: any,
        public question_text:string,
        public answers: any[]
    ){	
    	if(!this.answers.length){
	    	for (var i = 0; i < 4; ++i) {
	    		let answer = new Answer("", "", false);
	    		this.answers.push(answer);
	    	}
    	}
    }
}


// export interface Question {
// 	id:any;
//     question_text: string;
//     answers: Array<{
//     	id: any,
//         answer_text: string,
//         is_right: boolean
//     }>,
// }