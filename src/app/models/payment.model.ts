export class Payment {
    constructor(        
        public id: string,    
        public hashId: string,    
        public paymentOption: string,
        public amountPaid: number,
        public itemPrice: number,
        public sellerEmail: string,
        public buyerName: string,
        public buyerEmail: string,
        public itemDescription: string,
        public paymentDate: Date,
        public paymentStatus: string,        
        public currency: string,        
        public correctPayment: boolean        
    ) {}    
}