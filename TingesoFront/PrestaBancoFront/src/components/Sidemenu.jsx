import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";
import CalculateIcon from "@mui/icons-material/Calculate";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DiscountIcon from "@mui/icons-material/Discount";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
    const navigate = useNavigate();

    const listOptions = () => (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <List>
                <ListItemButton onClick={() => navigate("/home")}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
            </List>

            <Divider />

            <List>
                <ListItemButton onClick={() => navigate("/simulation")}>
                    <ListItemIcon>
                        <CalculateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Simulador de Crédito" />
                </ListItemButton>
            </List>

            <List>
                <ListItemButton onClick={() => navigate("/register")}>
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registro de Cliente" />
                </ListItemButton>
            </List>

            <List>
                <ListItemButton onClick={() => navigate("/selectType")}>
                    <ListItemIcon>
                        <PaidIcon />
                    </ListItemIcon>
                    <ListItemText primary="Solicitud de Crédito" />
                </ListItemButton>
            </List>

            <List>
                <ListItemButton onClick={() => navigate("/statusRequest")}>
                    <ListItemIcon>
                        <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Estado de Solicitud" />
                </ListItemButton>
            </List>

            <List>
                <ListItemButton onClick={() => navigate("/requests")}>
                    <ListItemIcon>
                        <DiscountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Listado de Solicitudes" />
                </ListItemButton>
            </List>
        


        </Box>



    );

    return (
        <div>
            <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
                {listOptions()}
            </Drawer>
        </div>
    );
}