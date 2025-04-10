import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import AppartementComponent from "@/components/AppartementComponent";

export default async function AppartementPage() {
    // Fetch all apartments
    const appartements = await HttpService.get(API_URL.appartements);

    return (
        <>
            <AppartementComponent appartements={appartements} />
        </>
    );
}