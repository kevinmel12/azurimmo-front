"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import Link from "next/link";
import { Button, Table, Tag, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Batiment from "@/models/Batiment";
import AddBatimentComponent from "@/components/AddBatimentComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";



export default function BatimentComponent({...props}:{batiments:Batiment[]}) {
    const [batiments, setBatiments] = useState<Batiment[]>(props.batiments);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [currentBatiment, setCurrentBatiment] = useState<Batiment | null>(null);

    const editBatiment = (batiment: Batiment) => {
        setCurrentBatiment(batiment);
        setShowAddDialog(true);
    }

    const saveBatiment = (batiment: Batiment) => {
        if (batiment.id) {
            HttpService.post(`${API_URL.batiments}${batiment.id}`, batiment)
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
            title:'Adresse',
            dataIndex:'adresse',
            key:'adresse'
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
            render:(text:string,record:Batiment)=>(
                <>
                    <Button shape={"circle"} onClick={() => {
                        editBatiment(record);
                    }}><EditOutlined /></Button>

                    <Button shape={"circle"} onClick={() => {
                        deleteBatiment(record.id);
                    }}><DeleteOutlined/></Button>
                </>
            )
        }
    ];

    return (
        <>
            <h2>Bâtiments</h2>
            <Button onClick={()=>{
                setShowAddDialog(true);
            }}>Ajouter...</Button><br/>
            {showAddDialog &&
                <AddBatimentComponent
                    batiment={currentBatiment || new Batiment()}
                    onClose={() => {
                        setShowAddDialog(false);
                        setCurrentBatiment(null);
                    }}
                    onSubmit={saveBatiment}
            />}
            <Link href={"/"}><Button>Retour à l'accueil</Button></Link>
            {!showAddDialog && <>
                <Table dataSource={batiments} rowKey={"id"} columns={batColumns}/>
            </>}
        </>);
}