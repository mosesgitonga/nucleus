import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Float "mo:base/Float";

actor {
  // report structure
  type CropReport = {
    crop: Text;
    disease: Text;
    lat: Float;
    lng: Float;
    timestamp: Int;
  };

  // Storage for all reports
  var reports: [CropReport] = [];

  // Submit a report (from backend)
  public func submitReport(r: CropReport): async () {
    reports := Array.append(reports, [r]);
    Debug.print("Added report: " # r.crop # " - " # r.disease);
  };

  // Get all reports (useful for admin or data dumps)
  public query func getAllReports(): async [CropReport] {
    return reports;
  };

  // Get filtered reports by disease and bounding box
  public query func getReportsByDiseaseAndRegion(
    disease: Text,
    minLat: Float,
    maxLat: Float,
    minLng: Float,
    maxLng: Float
  ): async [CropReport] {
    Array.filter(reports, func(r: CropReport): Bool {
      r.disease == disease
      and r.lat >= minLat and r.lat <= maxLat
      and r.lng >= minLng and r.lng <= maxLng
    });
  };

  // filter just by region (all diseases)
  public query func getReportsByRegion(
    minLat: Float,
    maxLat: Float,
    minLng: Float,
    maxLng: Float
  ): async [CropReport] {
    Array.filter(reports, func(r: CropReport): Bool {
      r.lat >= minLat and r.lat <= maxLat
      and r.lng >= minLng and r.lng <= maxLng
    });
  };
}