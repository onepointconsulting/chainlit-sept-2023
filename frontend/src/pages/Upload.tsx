import { useState } from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';

import Page from 'pages/Page';

import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';

import { grey } from '@chainlit/components/theme';

function getHost() {
  const hosts = ['localhost', '127.0.0.1'];
  for (const host of hosts) {
    if (window.location?.host?.includes(host)) {
      return `http://${host}:8080`;
    }
  }
  return '';
}

export default function Upload() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>();
  const [uploadMessage, setUploadMessage] = useState('');

  function uploadFile(
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) {
    if (acceptedFiles.length) {
      console.log(acceptedFiles);
      setAcceptedFiles(acceptedFiles);
      setUploadMessage('');
    }
    if (fileRejections.length) {
      setUploadMessage(
        'Files not accepted. Only one signle text file is accepted right now.'
      );
    }
  }

  async function sendUploadFile() {
    if (acceptedFiles?.length) {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      const response = await fetch(`${getHost()}/onepoint/best_practices`, {
        method: 'POST',
        body: formData
      });
      const json = await response.json();
      if (json) {
        setUploadMessage(json?.message);
        setAcceptedFiles([]);
      }
    }
  }

  return (
    <Page>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="60rem"
        mx="auto"
        flexGrow={1}
      >
        <Box my={2}>
          <section>Upload best practices file here:</section>
        </Box>
        <Box my={2}>
          <Dropzone onDrop={uploadFile} accept={{ 'text/plain': [] }}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <Stack
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? grey[800] : grey[200],
                    boxSizing: 'border-box'
                  }}
                  direction="row"
                  alignItems="center"
                  padding={2}
                  {...getRootProps({ className: 'dropzone' })}
                >
                  <input {...getInputProps()} />
                  <CloudUploadOutlined fontSize="large" />
                  <Stack ml={2}>
                    <Typography color="text.primary">
                      {!acceptedFiles?.length
                        ? 'Drag and drop file here'
                        : `"${acceptedFiles[0].name}" ready for upload.`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Limit 2mb.
                    </Typography>
                  </Stack>
                  {acceptedFiles && (
                    <LoadingButton
                      id={'upload-button'}
                      loading={false}
                      sx={{ ml: 'auto !important' }}
                      variant="contained"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        sendUploadFile();
                      }}
                    >
                      Upload
                    </LoadingButton>
                  )}
                </Stack>
                {!!uploadMessage && (
                  <Typography variant="caption" color="text.secondary">
                    {uploadMessage}
                  </Typography>
                )}
              </section>
            )}
          </Dropzone>
        </Box>
      </Box>
    </Page>
  );
}
