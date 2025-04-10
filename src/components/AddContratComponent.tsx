// File: src/components/AddContratComponent.tsx
import { useState, useEffect } from "react";
import { Button, Divider, Form, Input, Select, DatePicker, InputNumber, Space } from "antd";
import '@ant-design/v5-patch-for-react-19';
import Contrat from "@/models/Contrat";
import Appartement from "@/models/Appartement";
import Locataire from "@/models/Locataire";
import Garant from "@/models/Garant";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import dayjs from 'dayjs';

export default function AddContratComponent({...props}:{
    contrat: Contrat,
    onSubmit: (contrat: Contrat) => void,
    onClose: (show: boolean) => void
}) {
    const [contrat, setContrat] = useState<Contrat>(props.contrat);
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [garants, setGarants] = useState<Garant[]>([]);

    // Charger les données nécessaires
    useEffect(() => {
        // Ces endpoints doivent être créés côté backend pour que ça fonctionne
        HttpService.get(`${API_URL.batiments}appartements`)
            .then(data => setAppartements(data))
            .catch(error => console.error("Erreur lors du chargement des appartements:", error));

        // Il faudra ajouter ces URL dans ApiUrl.ts
        HttpService.get('http://127.0.0.1:9008/api/locataires/')
            .then(data => setLocataires(data))
            .catch(error => console.error("Erreur lors du chargement des locataires:", error));

        HttpService.get('http://127.0.0.1:9008/api/garants/')
            .then(data => setGarants(data))
            .catch(error => console.error("Erreur lors du chargement des garants:", error));
    }, []);

    return (
        <>
            <h3>{contrat.id ? 'Modifier le contrat' : 'Ajouter un contrat'}</h3>
            <Form layout="vertical">
                <Form.Item label="Appartement">
                    <Select
                        placeholder="Sélectionner un appartement"
                        value={contrat.appartement?.id}
                        onChange={(value) => {
                            const appt = appartements.find(a => a.id === value);
                            setContrat({...contrat, appartement: appt || null});
                        }}
                    >
                        {appartements.map(appt => (
                            <Select.Option key={appt.id} value={appt.id}>
                                {appt.batiment?.adresse} - N°{appt.numero} ({appt.surface} m², {appt.nbPieces} pièces)
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Locataire">
                    <Select
                        placeholder="Sélectionner un locataire"
                        value={contrat.locataire?.id}
                        onChange={(value) => {
                            const loc = locataires.find(l => l.id === value);
                            setContrat({...contrat, locataire: loc || null});
                        }}
                    >
                        {locataires.map(loc => (
                            <Select.Option key={loc.id} value={loc.id}>
                                {loc.nom} {loc.prenom}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Garant">
                    <Select
                        placeholder="Sélectionner un garant (optionnel)"
                        value={contrat.garant?.id}
                        allowClear
                        onChange={(value) => {
                            const gar = garants.find(g => g.id === value);
                            setContrat({...contrat, garant: gar || null});
                        }}
                    >
                        {garants.map(gar => (
                            <Select.Option key={gar.id} value={gar.id}>
                                {gar.nom} {gar.prenom}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Date d'entrée">
                    <DatePicker
                        style={{ width: '100%' }}
                        value={contrat.dateEntree ? dayjs(contrat.dateEntree) : null}
                        onChange={(date) => {
                            setContrat({...contrat, dateEntree: date ? date.format('YYYY-MM-DD') : ""});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Date de sortie (optionnelle)">
                    <DatePicker
                        style={{ width: '100%' }}
                        value={contrat.dateSortie ? dayjs(contrat.dateSortie) : null}
                        onChange={(date) => {
                            setContrat({...contrat, dateSortie: date ? date.format('YYYY-MM-DD') : ""});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Montant du loyer (€)">
                    <InputNumber
                        style={{ width: '100%' }}
                        value={contrat.montantLoyer}
                        min={0}
                        onChange={(value) => {
                            setContrat({...contrat, montantLoyer: value || 0});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Montant des charges (€)">
                    <InputNumber
                        style={{ width: '100%' }}
                        value={contrat.montantCharges}
                        min={0}
                        onChange={(value) => {
                            setContrat({...contrat, montantCharges: value || 0});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Statut">
                    <Select
                        placeholder="Sélectionner un statut"
                        value={contrat.statut}
                        onChange={(value) => {
                            setContrat({...contrat, statut: value});
                        }}
                    >
                        <Select.Option value="Actif">Actif</Select.Option>
                        <Select.Option value="Résilié">Résilié</Select.Option>
                        <Select.Option value="En attente">En attente</Select.Option>
                    </Select>
                </Form.Item>

                <Divider />
                <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="primary" onClick={() => {
                        props.onSubmit(contrat);
                    }}>Valider</Button>

                    <Button onClick={(e) => {
                        e.preventDefault();
                        props.onClose(false);
                    }}>Annuler</Button>
                </Space>
            </Form>
        </>
    );
}