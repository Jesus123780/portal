import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import ImageDialog from './ImageDialog';

const AttachFile = ({ images }) => {
  const [selectedDoc, setselectedDoc] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const theme = useTheme();

  if (images?.length === 0) {
    return <Alert severity="warning">No hay imágenes disponibles</Alert>;
  }

  return (
    <>
      <ImageDialog
        open={openModal}
        handleClose={() => {
          setopenModal(false);
        }}
        images={images}
      />
      <Grid
        md={12}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
      >
        <Button
          variant="contained"
          onClick={() => setopenModal(true)}
          disabled={selectedDoc.length === 0}
        >
          Comparar documentos
        </Button>
      </Grid>
      <Divider />
      <Grid md={12} style={{ display: 'flex', marginTop: 10 }}>
        {images.map((img, index) => {
          console.log(img);
          return (
            <Grid md={3} key={index}>
              <Card
                sx={{
                  p: 2,
                  marginRight: 3,
                  backgroundColor: selectedDoc.includes(img.image_id)
                    ? theme.colors.primary.lighter
                    : ''
                }}
              >
                <img
                  src={`data:image/png;base64,${img.data}`}
                  height={120}
                  width={'100%'}
                />
                <Divider />
                <Typography variant="h4" marginY={1}>
                  {img.document_name}
                </Typography>
                <Typography variant="subtitle2">
                  {dayjs(img.create_date).format('DD/MM/YYYY')}
                </Typography>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 15
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (!selectedDoc.includes(img.image_id)) {
                        setselectedDoc([...selectedDoc, img.image_id]);
                      } else {
                        const docs = selectedDoc.filter((doc) => {
                          return doc !== img.image_id;
                        });
                        setselectedDoc(docs);
                      }
                    }}
                  >
                    {selectedDoc.includes(img.image_id)
                      ? 'Quitar selección'
                      : 'Seleccionar documento'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default AttachFile;
