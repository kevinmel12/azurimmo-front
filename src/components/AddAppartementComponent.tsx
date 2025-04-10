"use client";
import Appartement from "@/models/Appartement";
import Batiment from "@/models/Batiment";
import { Button, Divider, Form, Input, InputNumber, Select, message } from "antd";
import { useState, useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

export default function AddAppartementComponent({ ...props }: {
    appartement: Appartement,
    onSubmit: (appartement: Appartement) => void,
    onClose: (show: boolean) => void
}) {
    const [appartement, setAppartement] = useState<Appartement>(props.appartement);
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const { Option } = Select;

    useEffect(() => {
        // Charger la liste des bâtiments pour le dropdown
        HttpService.get(API_URL.batiments)
            .then(data => {
                setBatiments(data);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des bâtiments:", error);
                message.error("Impossible de charger la liste des bâtiments");
            });
    }, []);

    const handleBatimentChange = (value: number) => {
        const selectedBatiment = batiments.find(b => b.id === value);
        if (selectedBatiment) {
            setAppartement({ ...appartement, batiment: selectedBatiment });
        }
    };

    return (
        <>
            <Form layout="vertical">
                <Form.Item label="Numéro">
                    <InputNumber
                        min={1}
                        value={appartement.numero}
                        onChange={(value) => {
                            setAppartement({ ...appartement, numero: value || 0 });
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Surface (m²)">
                    <InputNumber
                        min={1}
                        step={0.5}
                        value={appartement.surface}
                        onChange={(value) => {
                            setAppartement({ ...appartement, surface: value || 0 });
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Nombre de pièces">
                    <InputNumber
                        min={1}
                        value={appartement.nbPieces}
                        onChange={(value) => {
                            setAppartement({ ...appartement, nbPieces: value || 0 });
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Description">
                    <Input.TextArea
                        value={appartement.description}
                        onChange={(e) => {
                            setAppartement({ ...appartement, description: e.target.value });
                        }}
                        rows={3}
                    />
                </Form.Item>

                <Form.Item label="Bâtiment">
                    <Select
                        value={appartement.batiment?.id || undefined}
                        onChange={handleBatimentChange}
                        style={{ width: '100%' }}
                        placeholder="Sélectionner un bâtiment"
                    >
                        {batiments.map(batiment => (
                            <Option key={batiment.id} value={batiment.id}>
                                {batiment.adresse}, {batiment.ville}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Divider />

                <div className="flex justify-between">
                    <Button
                        type="primary"
                        onClick={() => {
                            props.onSubmit(appartement);
                        }}
                    >
                        Valider
                    </Button>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            props.onClose(false);
                        }}
                    >
                        Annuler
                    </Button>
                </div>
            </Form>
        </>
    );
}