export class Item {
    constructor(        
        public id: string,
        public itemName: string,
        public itemPrice: string,
        public currency: string,
        public theImages: string,
        public sellerId: number,
        public sellerEmail: string,
        public buyerName: string,
        public connectionChannel: string,
        public itemDescription: string,
        public itemSerialNo: string,
        public itemModelNo: string,
        public imeiFirst: string,
        public imeiLast: string, 
        public created: Date
    ) {}    
}

export class Image {
    constructor(        
        public id: string,
        public itemId: string,
        public imagePath: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}    
}