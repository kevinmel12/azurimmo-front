import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import AppartementComponent from "@/components/AppartementComponent";

export default async function BatimentDetailPage({ params }: { params: { id: string } }) {
    const batimentId = parseInt(params.id);

    // On peut pré-charger les appartements du bâtiment pour le rendu initial
    const appartements = await HttpService.get(API_URL.appartementsParBatiment(batimentId));

    return (
        <>
            <AppartementComponent
                appartements={appartements}
                batimentId={batimentId}
            />
        </>
    );
}