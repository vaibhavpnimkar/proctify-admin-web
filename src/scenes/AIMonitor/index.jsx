import React, { useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableRow, TableHead, TableBody, TableCell} from "@mui/material";

const AIMonitor = () => {
    const [data, setData] = React.useState([]);

    
    useEffect(()=>{
        const interval = setInterval(() => {
            fetch('http://localhost:3002/api/v1/chat/-1')
            .then(response => response.json())
            .then(data => setData(data.res));
        }, 1000)
        return () => clearInterval(interval);
    }, [data])
    

    return (
        <div>
            <h1>AI Monitor</h1>
            <Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ALERT</TableCell>
                            <TableCell>STUDENT_NAME</TableCell>
                            <TableCell>INFRACTION</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            return (
                                <TableRow>
                                    <TableCell>{row.sid}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.message}</TableCell>
                                    <TableCell><Button>Message</Button></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Box>
        </div>
    );
}

export default AIMonitor;