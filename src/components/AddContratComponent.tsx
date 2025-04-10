// src/components/AddContratComponent.tsx - Version simplifiée
import { useState } from "react";
import { Button, Divider, Form, Input, Select, DatePicker, InputNumber, Space } from "antd";
import '@ant-design/v5-patch-for-react-19';
import Contrat from "@/models/Contrat";
import dayjs from 'dayjs';

export default function AddContratComponent({...props}:{
    contrat: Contrat,
    onSubmit: (contrat: Contrat) => void,
    onClose: (show: boolean) => void
}) {
    const [contrat, setContrat] = useState<Contrat>(props.contrat);

    return (
        <>
            <h3>{contrat.id ? 'Modifier le contrat' : 'Ajouter un contrat'}</h3>
            <Form layout="vertical">
                {/* Champs simplifiés sans références aux autres entités */}
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