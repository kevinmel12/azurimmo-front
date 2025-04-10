import Appartement from "@/models/Appartement";
import Locataire from "@/models/Locataire";
import Garant from "@/models/Garant";


export default class Contrat {
    id: number = 0;
    dateEntree: string = "";
    dateSortie: string = "";
    montantLoyer: number = 0;
    montantCharges: number = 0;
    statut: string = "";
    appartement: Appartement | null = null;
    garant: Garant | null = null;
    locataire: Locataire | null = null;
}