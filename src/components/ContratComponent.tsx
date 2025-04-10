// File: src/components/ContratComponent.tsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import Link from "next/link";
import { Button, Table, Tag, Modal, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Contrat from "@/models/Contrat";
import AddContratComponent from "@/components/AddContratComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import dayjs from 'dayjs';

export default function ContratComponent({...props}:{contrats:Contrat[]}) {
    const [contrats, setContrats] = useState<Contrat[]>(props.contrats);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [currentContrat, setCurrentContrat] = useState<Contrat | null>(null);

    const editContrat = (contrat: Contrat) => {
        setCurrentContrat(contrat);
        setShowAddDialog(true);
    }

    const saveContrat = (contrat: Contrat) => {
        if (contrat.id) {
            HttpService.put(`${API_URL.contrats}${contrat.id}`, contrat)
                .then(response => {
                    setContrats(contrats.map(item =>
                        item.id === contrat.id ? response : item
                    ));
                    setShowAddDialog(false);
                    setCurrentContrat(null);
                    message.success("Contrat mis à jour avec succès");
                })
                .catch(error => {
                    console.log("Erreur lors de la mise à jour:", error);
                    message.error('Erreur lors de la mise à jour du contrat');
                });
        } else {
            updateContrat(contrat);
        }
    };

    const updateContrat = (contrat: Contrat) => {
        HttpService.post(API_URL.contrats, contrat).then((response) => {
            setContrats([...contrats, response]);
            setShowAddDialog(false);
        }).catch(error => {
            console.error("Erreur lors de la création:", error);
            message.error('Erreur lors de la création du contrat');
        });
    };

    const deleteContrat = (id: number) => {
        Modal.confirm({
            title: 'Confirmation de suppression',
            content: 'Êtes-vous sûr de vouloir supprimer ce contrat ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk() {
                HttpService.delete(`${API_URL.contrats}${id}`)
                    .then(() => {
                        setContrats(contrats.filter(contrat => contrat.id !== id));
                        message.success('Contrat supprimé avec succès');
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression:", error);
                        message.error('Erreur lors de la suppression du contrat');
                    });
            }
        });
    };

    const contratColumns = [
        {
            title: 'Locataire',
            dataIndex: ['locataire', 'nom'],
            key: 'locataire',
            /*render: (_: string, record: Contrat) => (
                <span>{record.locataire?.nom} {record.locataire?.prenom}</span>
            )*/
        },
        {
            title: 'Appartement',
            key: 'appartement',
            render: (_: string, record: Contrat) => (
                <span>
                    {record.appartement?.batiment?.adresse} - N°{record.appartement?.numero}
                </span>
            )
        },
        {
            title: 'Date d\'entrée',
            dataIndex: 'dateEntree',
            key: 'dateEntree',
            render: (date: string) => (
                <span>{dayjs(date).format('DD/MM/YYYY')}</span>
            )
        },
        {
            title: 'Date de sortie',
            dataIndex: 'dateSortie',
            key: 'dateSortie',
            render: (date: string) => (
                date ? <span>{dayjs(date).format('DD/MM/YYYY')}</span> : <span>-</span>
            )
        },
        {
            title: 'Loyer',
            dataIndex: 'montantLoyer',
            key: 'montantLoyer',
            render: (montant: number) => (
                <span>{montant} €</span>
            )
        },
        {
            title: 'Charges',
            dataIndex: 'montantCharges',
            key: 'montantCharges',
            render: (montant: number) => (
                <span>{montant} €</span>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut: string) => (
                <Tag color={statut === 'Actif' ? 'green' : 'red'}>{statut}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: string, record: Contrat) => (
                <Space>
                    <Button shape={"circle"} onClick={() => {
                        editContrat(record);
                    }}><EditOutlined /></Button>

                    <Button shape={"circle"} onClick={() => {
                        deleteContrat(record.id);
                    }}><DeleteOutlined /></Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <h2>Contrats de location</h2>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => {
                    setShowAddDialog(true);
                }}>Ajouter un contrat</Button>
                <Link href={"/"}><Button>Retour à l'accueil</Button></Link>
            </Space>

            {showAddDialog &&
                <AddContratComponent
                    contrat={currentContrat || new Contrat()}
                    onClose={() => {
                        setShowAddDialog(false);
                        setCurrentContrat(null);
                    }}
                    onSubmit={saveContrat}
                />}

            {!showAddDialog && (
                <Table
                    dataSource={contrats}
                    rowKey={"id"}
                    columns={contratColumns}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </>
    );
}