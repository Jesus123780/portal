import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Grid, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ModalDetailProps } from './types';
import { getItemStyle } from './helpers';
import { SkeletonList } from './SkeletonList';
import InboxIcon from '@mui/icons-material/Inbox';
import { TextField } from './styles';

export const ModalDetail: React.FC<ModalDetailProps> = ({
  data = [],
  distinctDocuments = [],
  loadingSave = false,
  open = false,
  selectDocument,
  title = '',
  valueSearch = '',
  isLoadingDataDocument = false,
  handleClose = () => {
    return;
  },
  handleSaveDocuments = () => {
    return;
  },
  onDragEnd = () => {
    return;
  },
  onChangeSearch = () => {
    return;
  },
  handleSelectDocument = () => {
    return;
  },
  sendAllDocumentsToDiscardDocument = () => {
    return;
  },
  sendAllDocumentsDiscardToSendDocument = () => {
    return;
  },
  sendOneDocumentToDiscardDocument = () => {
    return;
  },
  sendOneDocumentToSendDocumentDiscard = () => {
    return;
  }
}: ModalDetailProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      sx={{ width: '100vw', maxWidth: '100%', margin: 'auto' }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <DialogTitle
          sx={{
            m: 0,
            p: 2
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>{' '}
          <div
            style={{ borderBottom: '1px solid #a2a2a2', paddingBottom: '1rem' }}
          >
            <Typography
              color="black"
              variant="h3"
              component="h3"
              gutterBottom
              sx={{
                fontSize: 16,
                color: '#6e6e73',
                marginBottom: '1rem'
              }}
            >
              {title}
            </Typography>
          </div>
        </DialogTitle>

        <Box
          sx={{
            width: '100%',
            minHeight: '100%',
            height: '60%',
            padding: '20px',
            overflow: 'hidden'
          }}
        >
          <Grid
            container
            sx={{
              justifyContent: 'space-between'
            }}
          >
            <Grid item xs={4.9} sx={{ minHeight: '100%', padding: '18px' }}>
                <TextField
                  fullWidth
                  sx={{ width: '100%' }}
                  label="Search..."
                  onChange={onChangeSearch}
                  value={valueSearch}
                />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  borderRadius: '5px',
                  border: '1px solid #a2a2a269',
                  maxHeight: '500px',
                  height: 'calc(100vh - 100px)',
                  mt: 2,
                  overflowY: 'scroll'
                }}
              >
                {isLoadingDataDocument ? (
                  <SkeletonList />
                ) : (
                  <Droppable droppableId="dataList">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ height: '100%' }}
                      >
                        {data.length > 0 ? (
                          data.map((document, index) => {
                            const selected =
                              selectDocument?.id === document?.id;
                            return (
                              <Draggable
                                key={document?.id?.toString()}
                                draggableId={document?.id?.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      backgroundColor: selected
                                        ? '#e6e6e6'
                                        : 'white',
                                      ...getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )
                                    }}
                                    onClick={() => {
                                      return handleSelectDocument(document);
                                    }}
                                  >
                                    {document.text}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <InboxIcon
                              style={{ fontSize: '50px', color: 'lightgray' }}
                            />
                            <p>No hay documentos para mostrar</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </Box>
            </Grid>
            <Grid item xs={2} sx={{ minHeight: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  borderRadius: '5px'
                }}
              >
                <Button
                  disabled={isLoadingDataDocument}
                  onClick={sendAllDocumentsToDiscardDocument}
                  sx={{
                    borderRadius: '5px',
                    marginTop: '40px',
                    border: '1px solid #a2a2a269'
                  }}
                >
                  <FastForwardIcon />
                </Button>
                <Button
                  onClick={sendOneDocumentToDiscardDocument}
                  disabled={isLoadingDataDocument}
                  sx={{
                    borderRadius: '5px',
                    marginTop: '20px',
                    border: '1px solid #a2a2a269'
                  }}
                >
                  <ChevronRightIcon />
                </Button>
                <Button
                  onClick={sendOneDocumentToSendDocumentDiscard}
                  disabled={isLoadingDataDocument}
                  sx={{
                    borderRadius: '5px',
                    marginTop: '20px',
                    border: '1px solid #a2a2a269'
                  }}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  onClick={sendAllDocumentsDiscardToSendDocument}
                  disabled={isLoadingDataDocument}
                  sx={{
                    borderRadius: '5px',
                    marginTop: '20px',
                    border: '1px solid #a2a2a269'
                  }}
                >
                  <FastRewindIcon />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4.9} sx={{ minHeight: '100%' }}>
              <Typography
                color={'black'}
                variant="h3"
                component="h3"
                gutterBottom
                sx={{
                  fontSize: 16,
                  color: '#6e6e73',
                  marginBottom: '1rem'
                }}
              >
                Lista de Documento Obligatorio
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  borderRadius: '5px',
                  border: '1px solid #a2a2a269',
                  maxHeight: '500px',
                  height: 'calc(100vh - 100px)',
                  mt: 2,
                  overflowY: 'scroll'
                }}
              >
                {isLoadingDataDocument ? (
                  <SkeletonList wordCount={10} />
                ) : (
                  <Droppable droppableId="distinctDocumentsList">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ height: '100%' }}
                      >
                        {distinctDocuments?.length > 0 ? (
                          distinctDocuments.map((item, index) => {
                            const selected = selectDocument?.id === item?.id;
                            return (
                              <Draggable
                                key={item?.id?.toString()}
                                draggableId={item?.id?.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      backgroundColor: selected
                                        ? '#e6e6e6'
                                        : 'white',
                                      ...getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )
                                    }}
                                    onClick={() => {
                                      return handleSelectDocument(item);
                                    }}
                                  >
                                    {item.text}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <InboxIcon
                              style={{ fontSize: '50px', color: 'lightgray' }}
                            />
                            <p>No hay documentos para mostrar</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </Box>
              <Button
                startIcon={
                  loadingSave ? <CircularProgress size={20} /> : <SaveIcon />
                }
                onClick={handleSaveDocuments}
                sx={{
                  marginTop: '20px',
                  borderRadius: '5px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DragDropContext>
    </Dialog>
  );
};
