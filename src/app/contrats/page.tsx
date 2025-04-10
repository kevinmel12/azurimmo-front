import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import ContratComponent from "@/components/ContratComponent";


export default async  function ContratPage() {
    const contrats = await HttpService.get(API_URL.contrats);

    return (
        <>
            <ContratComponent contrats={contrats}/>
        </>
    );
}