import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import LocataireComponent from "@/components/LocataireComponent";

export default async function LocatairePage() {
    const locataires = await HttpService.get(API_URL.locataires);

    return (
        <>
            <LocataireComponent locataires={locataires} />
        </>
    );
}