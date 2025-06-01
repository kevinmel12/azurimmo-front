"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import Link from "next/link";
import { Button, Table, Modal, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Locataire from "@/models/Locataire";
import AddLocataireComponent from "@/components/AddLocataireComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import dayjs from 'dayjs';

export default function LocataireComponent({...props}:{locataires:Locataire[]}) {
    const [locataires, setLocataires] = useState<Locataire[]>(props.locataires);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [currentLocataire, setCurrentLocataire] = useState<Locataire | null>(null);

    const editLocataire = (locataire: Locataire) => {
        setCurrentLocataire(locataire);
        setShowAddDialog(true);
    }

    const saveLocataire = (locataire: Locataire) => {
        if (locataire.id) {
            HttpService.put(`${API_URL.locataires}${locataire.id}`, locataire)
                .then(response => {
                    setLocataires(locataires.map(item =>
                        item.id === locataire.id ? response : item
                    ));
                    setShowAddDialog(false);
                    setCurrentLocataire(null);
                    message.success("Locataire mis à jour avec succès");
                })
                .catch(error => {
                    console.log("Erreur lors de la mise à jour:", error);
                    message.error('Erreur lors de la mise à jour du locataire');
                });
        } else {
            updateLocataire(locataire);
        }
    };

    const updateLocataire = (locataire: Locataire) => {
        HttpService.post(API_URL.locataires, locataire).then((response) => {
            setLocataires([...locataires, response]);
            setShowAddDialog(false);
        }).catch(error => {
            console.error("Erreur lors de la création:", error);
            message.error('Erreur lors de la création du locataire');
        });
    };

    const deleteLocataire = (id: number) => {
        Modal.confirm({
            title: 'Confirmation de suppression',
            content: 'Êtes-vous sûr de vouloir supprimer ce locataire ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk() {
                HttpService.delete(`${API_URL.locataires}${id}`)
                    .then(() => {
                        setLocataires(locataires.filter(locataire => locataire.id !== id));
                        message.success('Locataire supprimé avec succès');
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression:", error);
                        message.error('Erreur lors de la suppression du locataire');
                    });
            }
        });
    };

    const locataireColumns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
        },
        {
            title: 'Date de naissance',
            dataIndex: 'dateN',
            key: 'dateN',
            render: (date: string) => (
                date ? <span>{dayjs(date).format('DD/MM/YYYY')}</span> : <span>-</span>
            )
        },
        {
            title: 'Lieu de naissance',
            dataIndex: 'lieuN',
            key: 'lieuN',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: string, record: Locataire) => (
                <Space>
                    <Button shape={"circle"} onClick={() => {
                        editLocataire(record);
                    }}><EditOutlined /></Button>

                    <Button shape={"circle"} onClick={() => {
                        deleteLocataire(record.id);
                    }}><DeleteOutlined /></Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <h2>Locataires</h2>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => {
                    setCurrentLocataire(null);
                    setShowAddDialog(true);
                }}>Ajouter un locataire</Button>
                <Link href={"/"}><Button>Retour à l'accueil</Button></Link>
            </Space>

            {showAddDialog && (
                <div className="mb-6 p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2">
                        {currentLocataire && currentLocataire.id ? 'Modifier le locataire' : 'Ajouter un locataire'}
                    </h3>
                    <AddLocataireComponent
                        locataire={currentLocataire || new Locataire()}
                        onClose={() => {
                            setShowAddDialog(false);
                            setCurrentLocataire(null);
                        }}
                        onSubmit={saveLocataire}
                    />
                </div>
            )}

            {!showAddDialog && (
                <Table
                    dataSource={locataires}
                    rowKey={"id"}
                    columns={locataireColumns}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </>
    );
}