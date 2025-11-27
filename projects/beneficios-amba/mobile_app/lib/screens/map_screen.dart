import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import '../theme/app_theme.dart';

class MapBeneficiosScreen extends StatefulWidget {
  const MapBeneficiosScreen({super.key});

  @override
  _MapBeneficiosScreenState createState() => _MapBeneficiosScreenState();
}

class _MapBeneficiosScreenState extends State<MapBeneficiosScreen> {
  final LatLng _buenosAires = const LatLng(-34.6037, -58.3816);
  List<dynamic> _shops = [];
  bool _isLoading = true;

  // URL de la API (Usar 10.0.2.2 para emulador Android, localhost para iOS/Web)
  final String _apiUrl = "http://10.0.2.2:8000/api/shops/"; 

  @override
  void initState() {
    super.initState();
    _fetchShops();
  }

  Future<void> _fetchShops() async {
    try {
      final response = await http.get(Uri.parse(_apiUrl));
      if (response.statusCode == 200) {
        setState(() {
          _shops = json.decode(response.body);
          _isLoading = false;
        });
      } else {
        print("Error API: ${response.statusCode}");
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print("Error conexión: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mapa de Beneficios"),
        backgroundColor: AppTheme.primaryBlue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : FlutterMap(
              options: MapOptions(
                initialCenter: _buenosAires,
                initialZoom: 13.0,
                maxZoom: 18.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  subdomains: const ['a', 'b', 'c'],
                  userAgentPackageName: 'com.beneficiosamba.app',
                ),
                MarkerLayer(
                  markers: _shops.map((shop) {
                    return Marker(
                      width: 80.0,
                      height: 80.0,
                      point: LatLng(shop['latitude'], shop['longitude']),
                      child: IconButton(
                        icon: const Icon(Icons.location_on, color: AppTheme.accentOrange, size: 45),
                        onPressed: () => _showShopDetails(context, shop),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
    );
  }

  void _showShopDetails(BuildContext context, dynamic shop) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          height: 300,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.store, color: AppTheme.primaryBlue, size: 30),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      shop['name'],
                      style: Theme.of(context).textTheme.headlineMedium,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryBlue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  shop['category'],
                  style: const TextStyle(color: AppTheme.secondaryBlue, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Oferta Destacada:", style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 5),
              // Aquí podrías hacer otra llamada a la API para traer las ofertas específicas de este shop
              const Card(
                elevation: 0,
                color: Color(0xFFFFF3E0), // Light Orange
                child: ListTile(
                  leading: Icon(Icons.local_offer, color: AppTheme.accentOrange),
                  title: Text("Ver ofertas disponibles"),
                  trailing: Icon(Icons.arrow_forward, size: 16),
                ),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text("IR AL LOCAL"),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
