import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { filterAgendamento, createAgendamento, updateForm } from '../../store/modules/agendamento/action';

import { Button, Drawer, Modal, Icon, Uploader } from 'rsuite';


import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Calendar, momentLocalizer, globalizeLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)


export default function Agendamentos() {

    const { form } = useSelector((state) => state.agendamento)

    const dispatch = useDispatch()

    const [openDrawer, setOpenDrawer] = useState(false)
    const [newAgenda, setNewAgenda] = useState({

        tittle: '',
        subTittle: '',
        description: '',
        data: '',
        imagens: {},
    })

    function capitalize(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`;
    }

    // useEffect(() => {


    //     // type: "@agendamento/filter",
    //     // start: moment().weekday(0).format('YYYY-MM-DD'),
    //     // end: moment().weekday(6).format('YYYY-MM-DD')


    // }, [])

    const save = () => {

        // dispatch(updateForm({ form: { ...form, loading: true } }))

        dispatch(createAgendamento())
    }
    return (


        <div className="col p-5 overflow-auto h-100">

            <Drawer
                show={openDrawer}
                size="xs"
                onHide={() => { setOpenDrawer(false) }}

            >

                <Drawer.Header>
                    <Drawer.Title> <h3> New Agendamento</h3></Drawer.Title>


                </Drawer.Header>
                <Drawer.Body>

                    <div className="row mt-3">


                        <div className="form-group col-6">
                            <b className="mb-3 h7"><strong>Titulo Evento</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Titulo do evento"
                                disabled={false}
                                value={capitalize(newAgenda.tittle)}
                                onChange={(e) => setNewAgenda({ ...newAgenda, tittle: e.target.value })}
                            />
                        </div>
                        <div className="form-group ">
                            <b className="mb-3 h7"><strong>Sub-titulo Evento</strong></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Titulo do evento"
                                disabled={false}
                                value={capitalize(newAgenda.subTittle)}
                                onChange={(e) => setNewAgenda({ ...newAgenda, subTittle: e.target.value })}
                            />
                        </div>
                        <div className="form-group  mt-10">
                            <b className="mb-3 h7"><strong>Descrição Evento</strong></b>
                            {/* <input
                                type="text"
                                className="form-control"
                                placeholder="Titulo do evento"
                                disabled={false}
                                // value={capitalize(cliente?.email)}
                                onChange={(e) => { }}
                            /> */}
                            <textarea
                                type="text"
                                class="form-control"
                                rows="3"
                                placeholder="Titulo do evento"
                                disabled={false}
                                value={capitalize(newAgenda.description)}
                                onChange={(e) => setNewAgenda({ ...newAgenda, description: e.target.value })}>


                            </textarea>
                        </div>
                        <div className="form-group  ">
                            <b className="mb-3 h7"><strong>Data   e Horário</strong></b>
                            <input
                                type="datetime-local"
                                className="form-control"
                                placeholder="Data do evento"
                                disabled={false}
                                value={newAgenda.data}
                                onChange={(e) => setNewAgenda({ ...newAgenda, data: (e.target.value).toString() })}
                            />
                        </div>
                    </div>
                    <div className="form-group col-6  " style={{ marginTop: 30 }}>
                        <b className="mb-3  h7 "><strong>Upload imagens </strong></b>
                        <Uploader
                            multiple
                            autoUpload={false}
                            listType="picture"
                            onChange={(files) => {
                                console.log(files)
                            }}     >


                        </Uploader>
                    </div>
                </Drawer.Body>
                <Drawer.Footer>
                    <Button
                        //disabled={ableToSave(cliente)}


                        block
                        className="btn-lg btn-success mt-3"
                        color="blue"

                        loading={form.loading}
                        onClick={() => {


                            // dispatch(updateForm({ ...form, loading: true }))
                            dispatch(createAgendamento())


                        }}

                        style={{ borderRadius: 5 }}
                    >
                        Salvar
                    </Button>
                </Drawer.Footer>
            </Drawer>


            <div className="row" >
                <div className="col-12">

                    <div className="w-100 d-flex justify-content-between " >

                        <h2>Agendamentos</h2>

                        <div className=" " >

                            <button className="btn btn-primary btn-lg" onClick={() => { setOpenDrawer(true) }}  >
                                <small className="mdi mdi-plus">Novo Agendamento</small>
                            </button>


                        </div>



                    </div>


                    {/* <h2 className="mb-4 mt-0">Agendamentos</h2> */}
                    <Calendar
                        localizer={localizer}
                        events={[
                            { title: "Evento teste", start: moment().toDate(), end: moment().add(30, 'minutes').toDate() },
                            { title: "Evento teste", start: moment().toDate(), end: moment().add(60, 'minutes').toDate() },
                            { title: "Evento teste", start: moment().toDate(), end: moment().add(90, 'minutes').toDate() }
                        ]}
                        // startAccessor="start"
                        // endAccessor="end"
                        selectable={true}
                        popup={true}
                        defaultView="agenda"
                        style={{ height: 400 }}
                    />

                </div>
            </div>

        </div>
    );
}