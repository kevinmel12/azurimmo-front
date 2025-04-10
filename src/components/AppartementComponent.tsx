"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import Link from "next/link";
import { Button, Table, Modal, message, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, HomeOutlined } from '@ant-design/icons';
import Appartement from "@/models/Appartement";
import AddAppartementComponent from "@/components/AddAppartementComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

export default function AppartementComponent({...props}: {appartements: Appartement[]}) {
    const [appartements, setAppartements] = useState<Appartement[]>(props.appartements);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [currentAppartement, setCurrentAppartement] = useState<Appartement | null>(null);

    const editAppartement = (appartement: Appartement) => {
        setCurrentAppartement(appartement);
        setShowAddDialog(true);
    }

    const saveAppartement = (appartement: Appartement) => {
        if (appartement.id) {
            HttpService.put(`${API_URL.appartements}${appartement.id}`, appartement)
                .then(response => {
                    setAppartements(appartements.map(item =>
                        item.id === appartement.id ? response : item
                    ));
                    setShowAddDialog(false);
                    setCurrentAppartement(null);
                    message.success("Appartement mis à jour avec succès");
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour:", error);
                    message.error('Erreur lors de la mise à jour de l\'appartement');
                });
        } else {
            createAppartement(appartement);
        }
    };

    const createAppartement = (appartement: Appartement) => {
        HttpService.post(API_URL.appartements, appartement)
            .then((response) => {
                setAppartements([...appartements, response]);
                setShowAddDialog(false);
                message.success("Appartement ajouté avec succès");
            })
            .catch(error => {
                console.error("Erreur lors de la création:", error);
                message.error('Erreur lors de la création de l\'appartement');
            });
    };

    const deleteAppartement = (id: number) => {
        Modal.confirm({
            title: 'Confirmation de suppression',
            content: 'Êtes-vous sûr de vouloir supprimer cet appartement ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk() {
                HttpService.delete(`${API_URL.appartements}${id}`)
                    .then(() => {
                        setAppartements(appartements.filter(appartement => appartement.id !== id));
                        message.success('Appartement supprimé avec succès');
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression:", error);
                        message.error('Erreur lors de la suppression de l\'appartement');
                    });
            }
        });
    };

    const appartementColumns = [
        {
            title: 'Numéro',
            dataIndex: 'numero',
            key: 'numero',
        },
        {
            title: 'Surface (m²)',
            dataIndex: 'surface',
            key: 'surface',
            render: (text: number) => (
                <span>{text} m²</span>
            )
        },
        {
            title: 'Nb Pièces',
            dataIndex: 'nbPieces',
            key: 'nbPieces',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Bâtiment',
            dataIndex: 'batiment',
            key: 'batiment',
            render: (batiment: any) => (
                batiment ? (
                    <Tag color="blue">
                        <HomeOutlined /> {batiment.adresse}, {batiment.ville}
                    </Tag>
                ) : <span>-</span>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: string, record: Appartement) => (
                <div className="space-x-2">
                    <Button
                        shape="circle"
                        onClick={() => editAppartement(record)}
                        title="Modifier"
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        shape="circle"
                        danger
                        onClick={() => deleteAppartement(record.id)}
                        title="Supprimer"
                    >
                        <DeleteOutlined />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Appartements</h2>

            <div className="mb-4 space-x-2">
                <Button
                    type="primary"
                    onClick={() => setShowAddDialog(true)}
                >
                    Ajouter un appartement
                </Button>
                <Link href="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>

            {showAddDialog && (
                <div className="mb-6 p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2">
                        {currentAppartement && currentAppartement.id ? 'Modifier l\'appartement' : 'Ajouter un appartement'}
                    </h3>
                    <AddAppartementComponent
                        appartement={currentAppartement || new Appartement()}
                        onClose={() => {
                            setShowAddDialog(false);
                            setCurrentAppartement(null);
                        }}
                        onSubmit={saveAppartement}
                    />
                </div>
            )}

            <Table
                dataSource={appartements}
                columns={appartementColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </>
    );
}