import { Add, CheckBox, Edit, People, Search } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from '@/store';
import Modal from '@/modules/Masters/ModalCreate';
import ModalEdit from '../ModalEdit';
import { bacFetch } from '@/utils/service_config';
import { useRouter } from 'next/router';
import { ModalDetail } from '../ModalDetail';
import { IDataDocument } from '../ModalDetail/types';
import { v4 as uuidv4 } from 'uuid';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TableSection = ({
  screenName,
  spList = '',
  spCreate = '',
  config = [],
  showCode = false,
  internalName
}) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [searchTextfilter, setSearchTextFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoadingDataDocument, setIsLoadingDataDocument] = useState(false);
  const [valueDocument, setValueDocument] = useState<string>('');
  const [initialDocument, setInitialDocument] = useState([]);
  const [page, setPage] = useState(0);
  const [distinctDocuments, setDistinctDocuments] = useState<IDataDocument[]>(
    []
  );
  const [documents, setDocuments] = useState<IDataDocument[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDetail, setOpenDetail] = useState(false);
  const { user } = useSelector((state) => state.permissions);
  const router = useRouter();
  const [selectDocument, setSelectDocument] = useState<IDataDocument>({
    id: '',
    text: '',
    value: ''
  });
  const handleClose = (): void => {
    setOpen(false);
    setDistinctDocuments([]);
    setDocuments([]);
    setInitialDocument([]);
  };

  const handleCloseEdit = (): void => {
    setOpenEdit(false);
  };

  const returnsData = useCallback(
    async (page, rowsPerPage, search = '') => {
      let params = ``;
      if (internalName === 'officer') {
        params = `null,${rowsPerPage},${page},'${search}'`;
      } else if (internalName === 'branchOffice') {
        params = `${rowsPerPage},${page},'${search}'`;
      }
      const res = await bacFetch(`/api/connection/${spList}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: params
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    [spList]
  );

  useEffect(() => {
    returnsData(page + 1, rowsPerPage)
      .then((res) => {
        if (user.qa && internalName === 'reason') {
          const filteredData = res.filter((value) => {
            return value.disable === null || value.disable === false;
          });
          setData(filteredData);
          setLoading(false);
        } else {
          setData(res);
          setLoading(false);
        }
      })
      .catch((_err) => {
        setData([]);
        setLoading(false);
      });
  }, [returnsData, user, internalName, page, rowsPerPage]);

  const fetchData = () => {
    setLoading(true);
    returnsData(page + 1, rowsPerPage)
      .then((res) => {
        if (user.qa && internalName === 'reason') {
          const filteredData = res.filter((value) => {
            return value.disable === null || value.disable === false;
          });
          setData(filteredData);
          setLoading(false);
        } else {
          setData(res);
          setLoading(false);
        }
      })
      .catch((_err) => {
        setData([]);
        setLoading(false);
      });
  };

  const handlesearchtextfilter = (event) => {
    setSearchTextFilter(event.target.value);
  };

  const handleAddNew = () => {
    setOpen(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = async () => {
    if (searchTextfilter !== '') {
      let filterResults = [];
      if (internalName === 'provider') {
        filterResults = data.filter((val) => {
          return val[`UserName`].toLowerCase().includes(searchTextfilter);
        });
        setData(filterResults);
        return;
      }

      if (internalName === 'providerzone') {
        filterResults = data.filter((val) => {
          return val[`code`].toLowerCase().includes(searchTextfilter);
        });
        setData(filterResults);
        return;
      }
      if (internalName === 'officer' || internalName === 'branchOffice') {
        const result = await returnsData(
          page + 1,
          rowsPerPage,
          searchTextfilter
        );
        setData(result);
        return;
      }
      filterResults = data.filter((val) => {
        return val[`${internalName}_name`]
          .toLowerCase()
          .includes(searchTextfilter);
      });
      setData(filterResults);
    } else {
      fetchData();
    }
  };

  /**
   * Handles the search operation on the documents by filtering based on the input text.
   * It updates the state with the filtered results.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The input change event from the search field.
   */
  const handleSearchDocument = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;

    // Update the search field value
    setValueDocument(searchValue);

    // If searchValue is empty, reset the documents to the original state
    if (!searchValue.trim()) {
      return setDocuments(initialDocument);
    }

    // Filter documents based on the search text (case insensitive)
    const filteredResults = documents?.filter((doc) =>
      doc.text.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Update the state with the filtered documents
    setDocuments(filteredResults);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Si no hay destino, no hacer nada
    if (!destination) {
      return;
    }
    // Manejar reordenación en la misma lista
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(
        source.droppableId === 'dataList' ? documents : distinctDocuments
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'dataList') {
        setDocuments(items);
        setInitialDocument(items);
      } else {
        setDistinctDocuments(items);
      }
    }

    if (
      source.droppableId === 'dataList' &&
      destination.droppableId === 'distinctDocumentsList'
    ) {
      const sourceItems = Array.from(documents);
      const destItems = Array.from(distinctDocuments);
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Filtrar el elemento movido de la lista de destino (para evitar duplicados)
      const filteredDestItems = destItems.filter(
        (item) => item.id !== movedItem.id
      );

      // Añadir el elemento movido a la lista de destino
      filteredDestItems.splice(destination.index, 0, movedItem);
      setDistinctDocuments(filteredDestItems);

      // Opcionalmente, actualizar la lista de origen si es necesario
      setDocuments(sourceItems);
      setInitialDocument(sourceItems);
    } else if (
      source.droppableId === 'distinctDocumentsList' &&
      destination.droppableId === 'dataList'
    ) {
      const sourceItems = Array.from(distinctDocuments);
      const destItems = Array.from(documents);
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Filtrar el elemento movido de la lista de destino (para evitar duplicados)
      const filteredDestItems = destItems.filter(
        (item) => item.id !== movedItem.id
      );

      // Añadir el elemento movido a la lista de destino
      filteredDestItems.splice(destination.index, 0, movedItem);
      setDocuments(filteredDestItems);
      setInitialDocument(filteredDestItems);

      // Actualizar la lista de origen
      setDistinctDocuments(sourceItems);
    }
  };

  const fetchAPI = async (url, params) => {
    try {
      const response = await bacFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ params })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud a la API:', error);
      return null;
    }
  };

  const handleGetDocuments = async (procedureId) => {
    return fetchAPI(
      `/api/connection/sp_GetDocumentbyProcedureId`,
      `'${procedureId}'`
    );
  };

  const handleGetDistinctDocuments = async (procedureId) => {
    return fetchAPI(
      `/api/connection/sp_GetDocumentDistinctByProcedureId`,
      `'${procedureId}'`
    );
  };

  const formatData = (documentData): IDataDocument[] => {
    if (!documentData) return [];
    return documentData.map((item) => {
      return {
        ...item,
        id: uuidv4()
      };
    });
  };
  const [procedureId, setProcedureId] = useState<null | string>(null);
  const handleGetDetail = async (row) => {
    setOpenDetail(true);
    setIsLoadingDataDocument(true);
    setProcedureId(row.reason_id);
    const jsonData: IDataDocument[] = await handleGetDocuments(row.reason_id);
    const jsonDataDistinct: IDataDocument[] = await handleGetDistinctDocuments(
      row.reason_id
    );
    setIsLoadingDataDocument(false);
    if (jsonData || jsonDataDistinct) {
      setDocuments(formatData(jsonData));
      setInitialDocument(formatData(jsonData));
      setDistinctDocuments(formatData(jsonDataDistinct));
    } else {
      // Manejar el caso en que alguna de las solicitudes falla
      console.error('Error al obtener los documentos');
      setIsLoadingDataDocument(false);
    }
  };

  const [loadingSave, setLoadingSave] = useState(false);

  const fetchDocuments = async ({
    PROCEDURE_ID,
    DOCUMENT_ID,
    CREATE_BY,
    MANDATORY,
    joinedValues
  }) => {
    await bacFetch('/api/connection/sp_PostInsertMSTDocsProcedure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${PROCEDURE_ID}', '${DOCUMENT_ID}', '${CREATE_BY}', '${MANDATORY}', '${joinedValues}'`
      })
    });
  };
  const handleSaveDocuments = async () => {
    if (!documents?.length && !distinctDocuments?.length) {
      console.log('No hay documentos para guardar.');
      return;
    }
    const PROCEDURE_ID = Number(procedureId);

    if (isNaN(PROCEDURE_ID)) {
      console.error('Error: procedureId no es un número válido.');
      return;
    }

    const DOCUMENT_ID = 0;
    const CREATE_BY = 'SYSTEM';
    const MANDATORY = 1;
    const MANDATORY_DISTINCT = 0
    setLoadingSave(true);

    const joinedValues = documents
      ?.map((item: IDataDocument) => item?.value)
      .join(',');
    const joinedValuesDistinct = distinctDocuments?.map((item: IDataDocument)  => item?.value).join(',')
    if (joinedValues.length) {
      await fetchDocuments({
        PROCEDURE_ID,
        DOCUMENT_ID,
        CREATE_BY,
        MANDATORY,
        joinedValues
      });
    }

    if (joinedValuesDistinct.length) {
      await fetchDocuments({
        PROCEDURE_ID,
        DOCUMENT_ID,
        CREATE_BY,
        MANDATORY: MANDATORY_DISTINCT,
        joinedValues: joinedValuesDistinct
      })
    }
    setLoadingSave(false);
  };

  const handleSelectDocument = (document: IDataDocument): void => {
    setSelectDocument(document);
  };

  const sendAllDocumentsToDiscardDocument = () => {
    if (documents?.length === 0) return;
    setDistinctDocuments([...distinctDocuments, ...documents]);
    setDocuments([]);
    setInitialDocument([]);
  };

  const sendAllDocumentsDiscardToSendDocument = () => {
    if (distinctDocuments?.length === 0) return;
    setDocuments([...distinctDocuments, ...documents]);
    setInitialDocument([...distinctDocuments, ...documents]);
    setDistinctDocuments([]);
  };
  /**
   * Transfers the selected document to the distinct documents list, maintaining its original index.
   * If the selected document is found, it is removed from the documents list and added to the distinct documents list
   * in the same position it was in the documents list.
   */
  const sendOneDocumentToDiscardDocument = () => {
    // Encuentra el índice del documento seleccionado en el array de documentos.
    const documentIndex = documents.findIndex(
      (item) => item.id === selectDocument.id
    );

    // Verifica si se encontró el documento.
    if (documentIndex !== -1) {
      // Encuentra el documento usando el índice.
      const findDocument = documents[documentIndex];

      // Crea una nueva lista de documentos sin el documento seleccionado.
      const newDocuments = documents.filter(
        (_, index) => index !== documentIndex
      );

      // Actualiza la lista de documentos sin el documento seleccionado.
      setDocuments(newDocuments);
      setInitialDocument(newDocuments);
      // Inserta el documento seleccionado en la misma posición en la lista de distintos documentos.
      setDistinctDocuments((distinctDocuments) => [
        ...distinctDocuments.slice(0, documentIndex),
        findDocument,
        ...distinctDocuments.slice(documentIndex)
      ]);
    }
  };

  /**
   * Transfers the selected document from the distinct documents list back to the original documents list,
   * maintaining its original index.
   */
  const sendOneDocumentToSendDocumentDiscard = () => {
    // Encuentra el índice del documento seleccionado en el array de distintos documentos.
    const documentIndex = distinctDocuments.findIndex(
      (item) => item.id === selectDocument.id
    );

    // Verifica si se encontró el documento.
    if (documentIndex !== -1) {
      // Encuentra el documento usando el índice.
      const findDocument = distinctDocuments[documentIndex];

      // Crea una nueva lista de distintos documentos sin el documento seleccionado.
      const newDistinctDocuments = distinctDocuments.filter(
        (_, index) => index !== documentIndex
      );

      // Actualiza la lista de distintos documentos sin el documento seleccionado.
      setDistinctDocuments(newDistinctDocuments);

      // Inserta el documento seleccionado en la misma posición en la lista de documentos.
      setDocuments((documents) => [
        ...documents.slice(0, documentIndex),
        findDocument,
        ...documents.slice(documentIndex)
      ]);
      setInitialDocument((documents) => [
        ...documents.slice(0, documentIndex),
        findDocument,
        ...documents.slice(documentIndex)
      ]);
    }
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        title={`Crear ${screenName}`}
        subtitle={`Permite ingresar información de ${screenName}`}
        spCreate={spCreate}
        user={user.userName}
        fetchData={fetchData}
        showCode={showCode}
        internalName={internalName}
      />
      <ModalEdit
        open={openEdit}
        handleClose={handleCloseEdit}
        title={`Editar ${screenName}`}
        subtitle={`Permite editar información de ${screenName}`}
        selectedRow={selectedId}
        spCreate={spCreate}
        user={user.userName}
        fetchData={fetchData}
        showCode={showCode}
        internalName={internalName}
      />
      <ModalDetail
        data={documents}
        distinctDocuments={distinctDocuments}
        handleClose={() => {
          return setOpenDetail(false);
        }}
        handleSaveDocuments={handleSaveDocuments}
        isLoadingDataDocument={isLoadingDataDocument}
        loadingSave={loadingSave}
        onChangeSearch={handleSearchDocument}
        onDragEnd={onDragEnd}
        selectDocument={selectDocument}
        sendOneDocumentToSendDocumentDiscard={
          sendOneDocumentToSendDocumentDiscard
        }
        sendOneDocumentToDiscardDocument={sendOneDocumentToDiscardDocument}
        sendAllDocumentsToDiscardDocument={sendAllDocumentsToDiscardDocument}
        sendAllDocumentsDiscardToSendDocument={
          sendAllDocumentsDiscardToSendDocument
        }
        handleSelectDocument={handleSelectDocument}
        open={openDetail}
        title="Lista de Documentos"
        valueSearch={valueDocument}
      />
      <Grid item md={12}>
        <Card
          sx={{
            px: 2,
            pb: 3,
            pt: 3
          }}
        >
          <Grid style={{ display: 'flex' }} md={12}>
            <Grid item md={10}>
              <TextField
                label={
                  internalName === 'officer'
                    ? 'Buscar por cédula y estatus'
                    : 'Para realizar la búsqueda haga click en la lupa'
                } //"Para realizar la búsqueda haga click en la lupa"
                fullWidth
                value={searchTextfilter}
                onChange={handlesearchtextfilter}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" onClick={handleSearch}>
                      <IconButton edge="end" color="primary">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={2} style={{ paddingLeft: 10, display: 'flex' }}>
              <Button
                startIcon={<Add />}
                variant="contained"
                color="info"
                onClick={handleAddNew}
              >
                Crear nuevo
              </Button>
            </Grid>
          </Grid>
          <Divider style={{ marginTop: 20, marginBottom: 20 }} />
          <Grid md={12}>
            {loading ? (
              <>
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
              </>
            ) : (
              <>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        {config.map((col, index) => {
                          return (
                            <TableCell key={index} align="center">
                              {col.column}
                            </TableCell>
                          );
                        })}
                        {internalName === 'provider' && (
                          <TableCell align="center">QA</TableCell>
                        )}
                        {internalName !== 'providerzone' &&
                          internalName !== 'provider' &&
                          internalName !== 'qa' && (
                            <TableCell align="center">Estatus</TableCell>
                          )}
                        <TableCell align="center">Opciones</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.map((row, index) => {
                        return (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                            key={index}
                          >
                            {config.map((col, index) => {
                              return (
                                <TableCell key={index} align="center">
                                  {row[col.row]}
                                </TableCell>
                              );
                            })}
                            {internalName === 'provider' && (
                              <TableCell align="center">
                                <Chip
                                  label={
                                    row.quality ? 'Habilitado' : 'Deshabilitado'
                                  }
                                  color={row.quality ? 'success' : 'primary'}
                                />
                              </TableCell>
                            )}
                            {internalName !== 'providerzone' &&
                              internalName !== 'provider' &&
                              internalName !== 'qa' && (
                                <TableCell align="center">
                                  <Chip
                                    label={
                                      row.disable
                                        ? 'Habilitado'
                                        : 'DesHabilitado'
                                    }
                                    color={row.disable ? 'success' : 'primary'}
                                  />
                                </TableCell>
                              )}

                            <TableCell align="center">
                              {internalName === 'provider' && (
                                <>
                                  <Tooltip title="QA" placement="top">
                                    <Button
                                      variant="text"
                                      color="secondary"
                                      onClick={() => {
                                        router.push('/masters/qa');
                                      }}
                                      sx={{
                                        marginRight: 1
                                      }}
                                    >
                                      <CheckBox />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip
                                    title="Formalizadores"
                                    placement="top"
                                  >
                                    <Button
                                      variant="text"
                                      color="secondary"
                                      onClick={() => {
                                        router.push('/masters/formalizers');
                                      }}
                                      sx={{
                                        marginRight: 1
                                      }}
                                    >
                                      <People />
                                    </Button>
                                  </Tooltip>
                                </>
                              )}
                              <Tooltip title="Editar" placement="top">
                                <Button
                                  variant="text"
                                  color="secondary"
                                  onClick={() => {
                                    setSelectedId(row);
                                    setOpenEdit(true);
                                  }}
                                >
                                  <Edit />
                                </Button>
                              </Tooltip>
                              <Button
                                variant="text"
                                onClick={() => {
                                  handleGetDetail(row);
                                }}
                              >
                                Detalles
                                <div
                                  style={{
                                    margin: '0 10px',
                                    display: 'flex',
                                    placeItems: 'center'
                                  }}
                                >
                                  <VisibilityIcon />
                                </div>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {data.length === 0 && (
                    <Alert
                      style={{ width: '100%', marginTop: 10 }}
                      severity="warning"
                    >
                      No hay datos disponibles en la tabla
                    </Alert>
                  )}
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  component="div"
                  count={data[0]?.totalFiltered || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Registros por página"
                />
              </>
            )}
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default TableSection;
