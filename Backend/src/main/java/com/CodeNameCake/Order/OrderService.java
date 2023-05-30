package com.CodeNameCake.Order;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    ////////////////////
    // PDF GET METHOD //
    ////////////////////
    public void exportPDF(HttpServletResponse response, Long orderId){
        Document document = new Document(PageSize.A4);
        // write pdf from document to the response's output stream
        try {
            PdfWriter.getInstance(document, response.getOutputStream());

            // writing on doc
            document.open();
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            titleFont.setSize(24);
            Font contentFont = FontFactory.getFont(FontFactory.HELVETICA);
            contentFont.setSize(13);

            Paragraph title = new Paragraph("<Shop Name>'s Order Receipt: " + orderId, titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph content = new Paragraph("This is some content", contentFont);
            content.setAlignment(Paragraph.ALIGN_LEFT);

            // add content to doc
            document.add(title);
            document.add(content);

            // close doc
            document.close();

        } catch (IOException e) {
            System.out.println("Error generating receipt PDF");
            throw new RuntimeException(e);
        }

    }
}
