

export  default class HttpService{

    static async get(url:string){
        const response=await fetch(url);
        return await response.json();
    }

    /*static static async request(method:string, url:string,data:any,headers?: any){
        const rHeaders={...headers,'Content-Type':'application/json'};
        const response=await fetch(url,{
            method,
            headers:rHeaders,
            body:JSON.stringify(data)});
        return await response.json();
    }*/


    static async post(url:string,data:any,headers?: any){
        const rHeaders={...headers,'Content-Type':'application/json'};
        const response=await fetch(url,{
            method:'POST',
            headers:rHeaders,
            body:JSON.stringify(data)});
        return await response.json();
    }

    static async delete(url:string){
        const response=await fetch(url,{
            method:'DELETE'
        });

        if (response.status === 204){
            return true;
        }
        return await response.json();
    }
}