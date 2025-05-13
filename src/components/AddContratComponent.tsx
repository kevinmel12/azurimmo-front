import { useState, useEffect } from "react";
import { Button, Divider, Form, Select, DatePicker, InputNumber, Space, message } from "antd";
import '@ant-design/v5-patch-for-react-19';
import Contrat from "@/models/Contrat";
import Appartement from "@/models/Appartement";
import Locataire from "@/models/Locataire";
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
    const [loading, setLoading] = useState(true);

    // Charger les données nécessaires
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Charger les appartements
                try {
                    const appartementsData = await HttpService.get(API_URL.appartements || 'http://127.0.0.1:9008/api/appartements/');
                    setAppartements(appartementsData);
                } catch (error) {
                    console.error("Erreur lors du chargement des appartements:", error);
                    message.warning("Impossible de charger les appartements");
                }

                // Charger les locataires
                try {
                    const locataireData = await HttpService.get(API_URL.locataires || 'http://127.0.0.1:9008/api/locataires/');
                    setLocataires(locataireData);
                } catch (error) {
                    console.error("Erreur lors du chargement des locataires:", error);
                    message.warning("Impossible de charger les locataires");
                }

            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <>
            <h3>{contrat.id ? 'Modifier le contrat' : 'Ajouter un contrat'}</h3>
            <Form layout="vertical">

                {/* Sélection d'appartement */}
                <Form.Item label="Appartement" required>
                    <Select
                        placeholder="Sélectionner un appartement"
                        value={contrat.appartement?.id}
                        loading={loading}
                        onChange={(value) => {
                            const appt = appartements.find(a => a.id === value);
                            setContrat({...contrat, appartement: appt || null});
                        }}
                    >
                        {appartements.map(appt => (
                            <Select.Option key={appt.id} value={appt.id}>
                                N°{appt.numero} - {appt.surface} m² - {appt.nbPieces} pièce(s)
                                {appt.batiment && ` - ${appt.batiment.adresse}, ${appt.batiment.ville}`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Sélection de locataire - Affiché même s'il n'y a pas de locataires */}
                <Form.Item label="Locataire" required>
                    <Select
                        placeholder="Sélectionner un locataire"
                        value={contrat.locataire?.id}
                        loading={loading}
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

                <Form.Item label="Date d'entrée" required>
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

                <Form.Item label="Montant du loyer (€)" required>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={contrat.montantLoyer}
                        min={0}
                        onChange={(value) => {
                            setContrat({...contrat, montantLoyer: value || 0});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Montant des charges (€)" required>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={contrat.montantCharges}
                        min={0}
                        onChange={(value) => {
                            setContrat({...contrat, montantCharges: value || 0});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Statut" required>
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
                <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button type="primary" onClick={() => {
                        // Validation des champs obligatoires
                        if (!contrat.appartement) {
                            message.error('Veuillez sélectionner un appartement');
                            return;
                        }
                        /*if (!contrat.locataire) {
                            message.error('Veuillez sélectionner un locataire');
                            return;
                        }*/
                        if (!contrat.dateEntree) {
                            message.error('Veuillez sélectionner une date d\'entrée');
                            return;
                        }
                        if (!contrat.statut) {
                            message.error('Veuillez sélectionner un statut');
                            return;
                        }

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