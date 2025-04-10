import Batiment from "./Batiment";

export default class Appartement {
    id: number = 0;
    numero: number = 0;
    surface: number = 0;
    nbPieces: number = 0;
    description: string = "";
    //batiment: Batiment = new Batiment();
    batiment: Batiment | null = null;
}