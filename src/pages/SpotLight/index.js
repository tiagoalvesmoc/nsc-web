import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";

import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  deleteObject,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { uuid } from "uuidv4";

import {
  Button,
  Drawer,
  Modal,
  Avatar,
  Uploader,
  Progress,
  Notification,
} from "rsuite";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SpotLight() {
  const [uid, setUid] = useState(uuid());

  const [imagesSpotLight, setImageSpotLight] = useState([]);

  const [listLider, setListLider] = useState([]);
  const [component, setComponents] = useState({
    disable: false,
    loading: false,
    title: "",
  });

  const [progressUpload, setProgressUpload] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadPage, setLoadPage] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [userData, setUserData] = useState(false);
  const [modalTempData, setModalTempData] = useState({});

  const [spotlight, setSpotlight] = useState({
    title: "",
    subtitle: "",
    description: "",
    data: "",
    hour: "",
    contact: "",
    access: "",
    id: uid,
    banner: "",
    imagesSpotLight: [],
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "spotlight");

    const getLider = async () => {
      const data = await getDocs(liderColection);
      setListLider(data.docs.map((doc) => ({ ...doc.data() })));

      setLoading(false);
    };

    getLider();
  }, [loadPage]);

  const updateLider = () => {
    console.log(setSpotlight);

    window.location.reload();
  };

  //function **********************************//

  function stringToAlt(str) {
    // //-> String Original.
    // return str[0].toUpperCase() + str.substr(1);

    var subst = str?.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
    return subst;
  }

  function showModalData(data) {
    setModalTempData(data);
    setOpenModal(true);
  }
  const handleOpen = () => setOpenModal(!openModal);
  const handleClose = () => setOpenModal(false);

  function showDrawer(data, title) {
    setOpenDrawer(true);
    setUserData({ ...data, title: title });
  }

  const handleUpload = async () => {
    setLoading(true);

    const storage = getStorage();

    const promisesAvatar = [];
    const promisescelulasImage = [];

    //Subindo imagem avatar Lider
    imagesSpotLight.map((image) => {
      const storageRefLiderAvatar = ref(
        storage,
        `spotlight/${spotlight.id}/${spotlight.id}`
      );
      const uploadTaskLiderAvatar = uploadBytesResumable(
        storageRefLiderAvatar,
        image
      );
      promisesAvatar.push(uploadTaskLiderAvatar);

      uploadTaskLiderAvatar.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
          setComponents({ ...component, title: "Uploading.." });
          // console.log("Upload avatar " + progress + "% done");
        },

        (error) => {
          console.log(error);
          return;
        },
        () => {
          getDownloadURL(uploadTaskLiderAvatar.snapshot.ref)
            .then((downloadURL) => {
              const user = doc(getFirestore(), "spotlight/", spotlight.id);

              setDoc(doc(getFirestore(), "spotlight", spotlight.id), spotlight);

              const frankDocRef = doc(
                getFirestore(),
                "spotlight",
                spotlight.id
              );
              updateDoc(frankDocRef, {
                banner: downloadURL,
              });

              setProgressUpload(0);
              setImageSpotLight([]);
              setLoadPage(!loadPage);
              setOpenDrawer(false);
              // setLoading(false)
            })
            .catch((err) => {
              console.log(err);
              setLoadPage(!loadPage);
              return;
            });
        }
      );
    });
  };

  const deleteSpotLight = async (id) => {
    // [START delete_document]

    console.log(id);

    deleteDoc(doc(getFirestore(), "spotlight", id))
      .then(() => {
        const deleteStorage = ref(getStorage(), `spotlight/${id}/${id}`);
        deleteObject(deleteStorage)
          .then(() => {
            notify("success", "Wow...");
            setLoadPage(!loadPage);
          })

          .catch((error) => {
            notify("error", " Wrong...");
            setLoadPage(!loadPage);
          });
      })
      .catch((err) => {
        notify("error", " Wrong...");
        setLoadPage(!loadPage);
      });
    // [END delete_document]
  };

  const notify = (type, message) => {
    setOpenDrawer(false);
    setOpenModal(false);
    switch (type) {
      case "success":
        return toast.success(message, {
          position: toast.POSITION.TOP_LEFT,
        });
      case "error":
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
        });

      default:
        break;
    }
  };
  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="modal-container">
        <Modal full show={openModal} onClose={handleClose} onHide={handleOpen}>
          <Modal.Header>
            <Modal.Title>SpotLight Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card mb-3" style={{ maxWidth: 540 }}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    style={{ width: 540, height: 150 }}
                    src={modalTempData.banner}
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{modalTempData?.title}</h5>
                    <p class="card-text">{modalTempData?.description}</p>
                    <p class="card-text">
                      <small class="text-muted">Last updated 3 mins ago</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>{" "}
          <Modal.Footer>
            <Button
              onClick={() => handleClose()}
              color="green"
              appearance="primary"
            >
              Fechar
            </Button>
            <Button color="red" appearance="primary" onClick={() => {}}>
              Deletar Live
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Drawer
        show={openDrawer}
        size="lg"
        onHide={() => {
          setOpenDrawer(!openDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            <h3 class="display-8">
              {userData?.title ? userData?.title : "  Novo SpotLight"}{" "}
              {userData?.lidernome}
            </h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="row mt-1">
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Titulo</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="titulo"
                  disabled={component.disable}
                  value={spotlight.title}
                  onChange={(e) =>
                    setSpotlight({
                      ...spotlight,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>Sub-Titulo</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder=" subtitle    "
                  disabled={component.disable}
                  value={spotlight.subtitle}
                  onChange={(e) =>
                    setSpotlight({
                      ...spotlight,
                      subtitle: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Descrição</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="titulo"
                  disabled={component.disable}
                  value={spotlight.description}
                  onChange={(e) =>
                    setSpotlight({
                      ...spotlight,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>Dia/Horário</strong>
                </b>
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Dia/Horário"
                  disabled={component.disable}
                  value={spotlight.horario}
                  onChange={(e) =>
                    setSpotlight({
                      ...spotlight,
                      hour: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>Telefone/WathsApp/Contato</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Telefone/WathsApp"
                  disabled={component.disable}
                  value={spotlight.telefone}
                  onChange={(e) =>
                    setSpotlight({
                      ...spotlight,
                      contact: e.target.value,
                    })
                  }
                />
              </div>

              <div
                className="form-group col-6 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Banner Principal</h4>
                </b>

                <Uploader
                  autoUpload={false}
                  listType="picture"
                  onChange={(files) => {
                    const arquivos = files
                      .filter((f) => f.blobFile)
                      .map((f) => f.blobFile);

                    setImageSpotLight(arquivos);

                    console.log(imagesSpotLight);
                  }}
                  onRemove={(f) => console.log(f)}
                ></Uploader>
              </div>

              <br />
              <br />
            </div>

            <Button
              block
              className="btn-lg btn-success mt-3"
              color={"green"}
              size="lg"
              onClick={() => handleUpload()}
              loading={component.loading}
              disabled={component.disable}
            >
              {loading ? (
                <Progress.Line
                  percent={progressUpload.toFixed(0)}
                  showInfo={component?.title}
                  strokeColor="blue"
                />
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Drawer.Body>
        </Drawer.Header>
      </Drawer>

      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between ">
            <h2>SpotLight - Destaques</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "  Novo SpotLight");
              }}
            >
              Novo SpotLight
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Banner</th>
                <th scope="col">Titulo</th>
                <th scope="col">Sub-Titulo</th>
                <th scope="col">Descrição</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody class="overflow-auto">
                {listLider?.map((lider) => (
                  <tr>
                    <th scope="row">
                      <Avatar src={lider?.banner} alt="@" size="lg" />
                    </th>

                    <td onClick={() => showModalData(lider)}>
                      {stringToAlt(lider?.title)}
                    </td>
                    <td onClick={() => showModalData(lider)}>
                      {stringToAlt(lider?.subtitle)}
                    </td>
                    <td onClick={() => showModalData(lider)}>
                      {stringToAlt(lider?.description)}
                    </td>

                    <td>
                      <Button
                        onClick={showModalData}
                        color="green"
                        appearance="primary"
                      >
                        Detalhes
                      </Button>{" "}
                      <Button
                        color="red"
                        appearance="primary"
                        onClick={() => {
                          deleteSpotLight(lider.id, lider?.banner);
                        }}
                      >
                        Deletar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              ""
            )}
          </table>

          {loading ? (
            <div className="text-center mt-100">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            listLider.length <= 0 && (
              <div className="text-center mt-100">
                <div className="text-center" role="status">
                  <text>Nenhum dado encontrado</text>
                </div>
              </div>
            )
          )}
        </div>
        {/* <div className='row'>
                    <div className='col-sm-6'>



                        <div className="card"  >
                            <img className="card-img-top" src="https://firebasestorage.googleapis.com/v0/b/nossacasa-4d613.appspot.com/o/celulas-images%2F2092ef3f-0241-4955-893c-dd35c4c99411%2F464d2aff-a479-4899-af34-1df02cd74f86?alt=media&token=3d3c7793-e6ee-482e-aaee-cbe6ebca4ed0" alt="Card image cap" style={{ width: 150, height: 150 }} />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                        <br />


                    </div>

                </div> */}
      </div>
      <ToastContainer />
    </div>
  );
}
