import React, { useEffect, useState } from 'react';
import Tables from '../../components/Tables';
import { Button, Drawer, Modal, Icon } from 'rsuite';



import { useDispatch, useSelector } from 'react-redux'



import {
    allClientes,
    updateClientes,
    filterCliente,
    createNewUser,
    addCliente,
    unlinkCliente
} from '../../store/modules/cliente/action';







export default function Clientes() {


    const dispatch = useDispatch()

    const setCliente = (key, value) => {
        dispatch(
            updateClientes({
                cliente: { ...cliente, [key]: value },
            })
        );
    };








    const { clientes, new_user, cliente, form, components, behavior } = useSelector((state) => state.cliente)


    const setComponents = (component, state) => {
        dispatch(updateClientes({

            form: { ...form, filtering: false, disabled: true, },
            components: { ...components, [component]: state }
        }))


    }

    const save = () => {
        dispatch(addCliente())

    }
    const remove = () => {
        dispatch(unlinkCliente())

    }
    useEffect(() => {


        dispatch(allClientes())



    }, [])

    function capitalize(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`;
    }


    return (
        <div className="col p-5 overflow-auto h-100">

            <Drawer
                show={components.drawer}
                size="md"
                onHide={() =>
                    // setComponents('drawer', false),
                    dispatch(

                        updateClientes({
                            behavior: "create",
                            components: { ...components, drawer: false }

                        }),


                    )

                }>

                <Drawer.Header>
                    <Drawer.Title> <h3>{behavior === "create" ? 'Criar novo' : 'Atualizar'}</h3></Drawer.Title>


                </Drawer.Header>
                <Drawer.Body>

                    <div className="row mt-3">
                        <div className="form-group col-12  mb-3">
                            <div class="input-group " >
                                <input
                                    type="email"
                                    class="form-control"
                                    placeholder="E-mail do Usuario"
                                    disabled={behavior !== 'create'}
                                    onChange={(e) => {
                                        setCliente('email', e.target.value);

                                    }}

                                />
                                {behavior === 'create' && (
                                    <div class="input-group-append ">
                                        <Button
                                            type="button" class="btn btn-success  btn-sm"
                                            style={{ margin: "2px" }}
                                            value={capitalize(cliente?.email)}
                                            appearance="primary"
                                            loading={form.filtering}
                                            disabled={!form.disabled}
                                            onClick={() => {
                                                dispatch(
                                                    filterCliente({
                                                        // filters: { email: cliente.email, status: 'A' },
                                                    })
                                                );
                                            }}
                                        >
                                            Pesquisar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group col-6">
                            <b className="h7"><strong>E-mail</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email do Usuario"
                                disabled={form.disabled}
                                value={capitalize(cliente?.email)}
                                onChange={(e) => setCliente('email', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Nome</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome do Usuario"
                                disabled={form.disabled}
                                value={capitalize(cliente?.name)}
                                onChange={(e) => setCliente('name', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Telefone / Whatsapp</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Telefone / Whatsapp do Usuario"
                                disabled={form.disabled}
                                value={cliente?.phone}
                                onChange={(e) => setCliente('phone', e.target.value)}
                            />
                        </div>

                        <div className="form-group col-6">
                            <b className=""><strong>Data de Nascimento</strong></b>
                            <input
                                type="date"
                                className="form-control"
                                disabled={form.disabled}
                                value={cliente?.birthday}
                                onChange={(e) => setCliente('birthday', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Sexo</strong></b>
                            <select
                                disabled={form.disabled}
                                className="form-control"
                                value={capitalize(cliente?.sexo)}
                                onChange={(e) => setCliente('sexo', e.target.value)}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>

                        <div className="form-group col-6">
                            <b className="h7"><strong>Tipo de documento</strong></b>
                            <select
                                disabled={form.disabled}
                                className="form-control"
                                value={cliente?.documento?.tipo}
                                onChange={(e) =>
                                    setCliente('documento', {
                                        ...cliente.documento?.tipo,
                                        tipo: e.target.value,
                                    })
                                }
                            >
                                <option value="cpf">CPF</option>
                                <option value="cnpj">CNPJ</option>
                            </select>
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Número do documento</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                disabled={form.disabled}
                                value={cliente?.cpf}
                                onChange={(e) =>
                                    setCliente('documento', {
                                        ...cliente.documento,
                                        numero: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="form-group col-6">
                            <b className="h7"><strong>CEP</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o CEP"
                                disabled={form.disabled}
                                value={capitalize(cliente?.endereco?.cep)}
                                onChange={(e) =>
                                    setCliente('endereco', {
                                        ...cliente.endereco,
                                        cep: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Rua / Logradouro</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rua / Logradouro"
                                disabled={form.disabled}
                                value={capitalize(cliente?.endereco?.logradouro)}
                                onChange={(e) =>
                                    setCliente('endereco', {
                                        ...cliente.endereco,
                                        logradouro: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Número</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Número"
                                disabled={form.disabled}
                                value={cliente?.endereco?.numero}
                                onChange={(e) =>
                                    setCliente('endereco', {
                                        ...cliente.endereco,
                                        numero: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>UF</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="UF"
                                disabled={form.disabled}
                                value={cliente?.endereco?.uf}
                                onChange={(e) =>
                                    setCliente('endereco', {
                                        ...cliente.endereco,
                                        uf: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="h7"><strong>Cidade</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cidade"
                                disabled={form.disabled}
                                value={capitalize(cliente?.endereco?.cidade)}
                                onChange={(e) =>
                                    setCliente('endereco', {
                                        ...cliente.endereco,
                                        cidade: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <Button
                            //disabled={ableToSave(cliente)}


                            block
                            className="btn-lg btn-success mt-3"
                            color={behavior === 'create' ? 'green' : 'red'}
                            size="lg"
                            loading={form.saving}
                            onClick={() => {
                                if (behavior === 'create') {
                                    save()
                                } else {
                                    setComponents('confirmDelete', true);
                                }
                            }}
                        >
                            <strong>
                                {behavior === 'create' ? 'Salvar' : 'Remover'} usuario
                            </strong>
                        </Button>
                    </div>
                </Drawer.Body>
            </Drawer>

            <Modal

                show={components.confirmDelete}
                onHide={() => { setComponents('confirmDelete', false) }}
                size="xs"
            >
                <Modal.Header>
                    <Modal.Title>
                        <p className="h7"><strong>Atenção!</strong></p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Icon
                        icon="remind"
                        style={{
                            color: '#ffb300',
                            fontSize: 24
                        }}
                    />
                    {' '}
                    <p class="h6"><strong>Tem certeza que deseja exlcuir? Esta ação será irreversivel!</strong></p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        loading={form.saving}
                        onClick={() => remove()}
                        color="red"
                    >
                        Sim tenho certeza

                    </Button>
                    <Button
                        loading={form.saving}
                        onClick={() => setComponents('confirmDelete', false)}
                        appearance="subtle"
                    >
                        Cancelar

                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="row" >
                <div className="col-12" >
                    <div className="w-100 d-flex justify-content-between " >

                        <h2>Usuários</h2>

                        <div className=" " >

                            <button className="btn btn-primary btn-lg"


                                onClick={() => {
                                    dispatch(updateClientes({

                                        behavior: "create"
                                    }),

                                    )
                                    setComponents('drawer', true)

                                }}
                            >
                                <small className="mdi mdi-plus">Novo Usuario</small>
                            </button>


                        </div>



                    </div>

                    <Tables
                        loading={form.filtering}
                        data={clientes}
                        config={[
                            { label: 'Nome', key: 'name', width: 200, fixed: true },
                            { label: 'Cpf', key: 'cpf', width: 200, fixed: true },
                            { label: 'Aniversario', key: 'birthday', width: 200, fixed: true },

                            {
                                label: 'Status',
                                key: 'status'
                            },


                            { label: 'Email', key: 'email' }
                        ]}

                        action={(cliente) => (

                            <Button color="#000" size="xs"

                                onClick={() => {

                                    dispatch(
                                        createNewUser(cliente),
                                        updateClientes({
                                            behavior: "",
                                            form: { disabled: false }
                                        }),


                                    )
                                    setComponents('drawer', true)

                                }}
                            >

                                Ver Informações</Button>
                        )}

                        onRowClick={(cliente) => {

                            dispatch(
                                updateClientes({
                                    cliente
                                })
                            );
                            dispatch(
                                updateClientes({
                                    behavior: 'update'
                                })
                            )
                            setComponents('drawer', true)



                        }}

                    />

                </div>

            </div>

        </div >
    );
}