/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

//import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpServletRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 *
 * @author Moises Juarez
 */
@Controller
@Async
public class ControladorGET {

   
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(HttpServletRequest sesion, Model model) {
        return "index";
    }

   
}
