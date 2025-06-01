"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Table, Tag, Modal, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Batiment from "@/models/Batiment";
import AddBatimentComponent from "@/components/AddBatimentComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

export default function BatimentComponent({...props}:{batiments:Batiment[]}) {
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [currentBatiment, setCurrentBatiment] = useState<Batiment | null>(null);

    // Initialiser l'état avec les props reçues
    useEffect(() => {
        if (props.batiments && Array.isArray(props.batiments)) {
            setBatiments(props.batiments);
        }
    }, [props.batiments]);

    const editBatiment = (batiment: Batiment) => {
        setCurrentBatiment(batiment);
        setShowAddDialog(true);
    }

    const saveBatiment = (batiment: Batiment) => {
        if (batiment.id) {
            HttpService.put(`${API_URL.batiments}${batiment.id}`, batiment)
                .then(response => {
                    setBatiments(batiments.map(item =>
                        item.id === batiment.id ? response : item
                    ));
                    setShowAddDialog(false);
                    setCurrentBatiment(null);
                    message.success("Bâtiment mis à jour avec succès");
                })
                .catch(error => {
                    console.log("Erreur lors de la mise à jour:", error);
                    message.error('Erreur lors de la mise à jour du bâtiment');
                });
        } else {
            updateBatiment(batiment);
        }
    };

    const updateBatiment=(batiment:Batiment)=> {
        HttpService.post(API_URL.batiments,batiment).then((response)=>{
            setBatiments([...batiments,response]);
            setShowAddDialog(false);
            message.success("Bâtiment ajouté avec succès");
        }).catch(error => {
            console.error("Erreur lors de la création:", error);
            message.error('Erreur lors de la création du bâtiment');
        });
    };

    const deleteBatiment= (id: number) => {
        Modal.confirm({
            title: 'Confirmation de suppression',
            content: 'Êtes-vous sûr de vouloir supprimer ce bâtiment ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk() {
                HttpService.delete(`${API_URL.batiments}${id}`)
                    .then(()=>{
                        setBatiments(batiments.filter(batiment => batiment.id !== id));
                        message.success('Bâtiment supprimé avec succès');
                    })
                    .catch(error=>{
                        console.error("Erreur lors de la suppression:", error);
                        message.error('Erreur lors de la suppression du bâtiment');
                    });
            }
        });
    };

    const batColumns=[
        {
            title:'ID',
            dataIndex:'id',
            key:'id',
        },
        {
            title:'Adresse',
            dataIndex:'adresse',
            key:'adresse',
        },
        {
            title:'Ville',
            dataIndex:'ville',
            key:'ville',
            render:(text:string)=>(
                <Tag color={"success"}>{text}</Tag>
            )
        },
        {
            title:'Actions',
            key:'action',
            render:(_:string,record:Batiment)=>(
                <Space>
                    <Button shape={"circle"} onClick={() => {
                        editBatiment(record);
                    }}><EditOutlined /></Button>

                    <Button shape={"circle"} onClick={() => {
                        deleteBatiment(record.id);
                    }}><DeleteOutlined/></Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Bâtiments</h2>

            <div className="mb-4 space-x-2">
                <Button
                    type="primary"
                    onClick={()=>{
                        setCurrentBatiment(new Batiment());
                        setShowAddDialog(true);
                    }}
                >
                    Ajouter un bâtiment
                </Button>
                <Link href="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>

            {showAddDialog && (
                <div className="mb-6 p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2">
                        {currentBatiment && currentBatiment.id ? 'Modifier le bâtiment' : 'Ajouter un bâtiment'}
                    </h3>
                    <AddBatimentComponent
                        batiment={currentBatiment || new Batiment()}
                        onClose={() => {
                            setShowAddDialog(false);
                            setCurrentBatiment(null);
                        }}
                        onSubmit={saveBatiment}
                    />
                </div>
            )}

            {!showAddDialog && (
                <Table
                    dataSource={batiments}
                    rowKey="id"
                    columns={batColumns}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </>
    );
}