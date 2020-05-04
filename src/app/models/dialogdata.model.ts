export class DialogData {
    constructor(        
    public itemId: string,
    public itemName: string,
    public intent_id: string,
    public amount: number,
    public description: string,
    public currency: string,
    public buyer: string,
    public commission: number,
    public itemPrice: number,
    public clientSecret: string, 
    public buyerEmail: string, 
    public realAmount: number,
    public seller_id: number, 
    public seller_email: string,
    public connectionChannel: string,
    public itemSerialNo: string,
    public itemModelNo: string,
    public imeiFirst: string,
    public imeiLast: string
    ) {}    
}