import { useState } from "react";
import {Button, Divider, Form, Input, DatePicker, Space, message} from "antd";
import '@ant-design/v5-patch-for-react-19';
import Locataire from "@/models/Locataire";
import dayjs from 'dayjs';

export default function AddLocataireComponent({...props}:{
    locataire: Locataire,
    onSubmit: (locataire: Locataire) => void,
    onClose: (show: boolean) => void
}) {
    const [locataire, setLocataire] = useState<Locataire>(props.locataire);

    return (
        <>
            <h3>{locataire.id ? 'Modifier le locataire' : 'Ajouter un locataire'}</h3>
            <Form layout="vertical">
                <Form.Item label="Nom" required>
                    <Input
                        placeholder="Nom du locataire"
                        value={locataire.nom}
                        onChange={(e) => {
                            setLocataire({...locataire, nom: e.target.value});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Prénom" required>
                    <Input
                        placeholder="Prénom du locataire"
                        value={locataire.prenom}
                        onChange={(e) => {
                            setLocataire({...locataire, prenom: e.target.value});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Date de naissance">
                    <DatePicker
                        style={{ width: '100%' }}
                        value={locataire.dateN ? dayjs(locataire.dateN) : null}
                        onChange={(date) => {
                            setLocataire({...locataire, dateN: date ? date.format('YYYY-MM-DD') : ""});
                        }}
                    />
                </Form.Item>

                <Form.Item label="Lieu de naissance">
                    <Input
                        placeholder="Lieu de naissance"
                        value={locataire.lieuN}
                        onChange={(e) => {
                            setLocataire({...locataire, lieuN: e.target.value});
                        }}
                    />
                </Form.Item>

                <Divider />
                <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="primary" onClick={() => {
                        // Validation simple
                        if (!locataire.nom || !locataire.prenom) {
                            message.error('Veuillez remplir les champs obligatoires');
                            return;
                        }
                        props.onSubmit(locataire);
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