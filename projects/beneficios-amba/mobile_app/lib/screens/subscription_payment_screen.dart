import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class SubscriptionPaymentScreen extends StatefulWidget {
  @override
  _SubscriptionPaymentScreenState createState() => _SubscriptionPaymentScreenState();
}

class _SubscriptionPaymentScreenState extends State<SubscriptionPaymentScreen> {
  File? _imageProof;
  final picker = ImagePicker();
  String _selectedPlan = 'MONTHLY';
  bool _isUploading = false;

  // Colores de Identidad "Beneficios AMBA"
  final Color _primaryBlue = Color(0xFF00A8E8); 

  Future getImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _imageProof = File(pickedFile.path);
      }
    });
  }

  Future<void> uploadPayment() async {
    if (_imageProof == null) return;
    
    setState(() => _isUploading = true);

    // Conexión con la API de Django (IP local para pruebas)
    // Nota: Asegúrate de que tu servidor Django esté corriendo y tu celular/emulador tenga acceso.
    var uri = Uri.parse("http://10.0.2.2:8000/api/payments/upload_proof/");
    var request = http.MultipartRequest('POST', uri);
    
    // Adjuntar datos
    request.fields['plan_selected'] = _selectedPlan;
    request.fields['amount'] = _selectedPlan == 'MONTHLY' ? '5000' : '50000'; // Ejemplo precios ARS
    request.files.add(await http.MultipartFile.fromPath('proof_image', _imageProof!.path));
    
    // Headers de autenticación (Token real vendría del estado de login)
    // TODO: Reemplazar con el token real del usuario logueado
    request.headers['Authorization'] = 'Token SU_TOKEN_DE_AUTENTICACION';

    try {
      var response = await request.send();

      setState(() => _isUploading = false);

      if (response.statusCode == 201 || response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('¡Comprobante enviado! Activaremos tu cuenta pronto.')));
      } else {
        print('Error upload: ${response.statusCode}');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error al subir. Código: ${response.statusCode}')));
      }
    } catch (e) {
      setState(() => _isUploading = false);
      print('Error connection: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error de conexión.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Activar mi Negocio"),
        backgroundColor: _primaryBlue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text("1. Elige tu Plan", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              DropdownButton<String>(
                value: _selectedPlan,
                isExpanded: true,
                items: [
                  DropdownMenuItem(value: 'MONTHLY', child: Text("Mensual (\$5.000 ARS)")),
                  DropdownMenuItem(value: 'QUARTERLY', child: Text("Trimestral (\$12.000 ARS - Ahorrá 20%)")),
                  DropdownMenuItem(value: 'ANNUAL', child: Text("Anual (\$40.000 ARS - Mejor Valor)")),
                ],
                onChanged: (val) => setState(() => _selectedPlan = val!),
              ),
              SizedBox(height: 20),
              
              Text("2. Transfiere al Alias: BENEFICIOS.AMBA", style: TextStyle(fontSize: 16)),
              SizedBox(height: 20),
          
              Text("3. Sube el Comprobante", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 10),
              GestureDetector(
                onTap: getImage,
                child: Container(
                  height: 150,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    border: Border.all(color: _primaryBlue),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: _imageProof == null
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [Icon(Icons.camera_alt, size: 50, color: Colors.grey), Text("Tocar para subir foto")],
                        )
                      : Image.file(_imageProof!, fit: BoxFit.cover),
                ),
              ),
              SizedBox(height: 30),
          
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: _primaryBlue, padding: EdgeInsets.all(15)),
                onPressed: _isUploading ? null : uploadPayment,
                child: _isUploading 
                  ? CircularProgressIndicator(color: Colors.white) 
                  : Text("ENVIAR COMPROBANTE", style: TextStyle(fontSize: 18, color: Colors.white)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
