import os
import joblib
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from children.models import Child
from physical_development_records.models import PhysicalDevelopmentRecord
from .services import analyze_child_measurement
from .llm_openai import generate_meal_recommendation
from .writing_prediction_engine import predict_child_writing_ability

# Proje kök dizinini al
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model dosyalarının tam yolları
classifier_path = os.path.join(BASE_DIR, 'ml_engine', 'models', 'writing_classifier.joblib')
regressor_path = os.path.join(BASE_DIR, 'ml_engine', 'models', 'writing_regressor.joblib')

# Modelleri bir kez yükle
clf_model = joblib.load(classifier_path)
reg_model = joblib.load(regressor_path)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def child_percentile_view(request, child_id):
    try:
        child = Child.objects.get(id=child_id)
        record = PhysicalDevelopmentRecord.objects.filter(child=child).order_by('-measurement_datetime').first()
        if not record:
            return Response({"error": "Ölçüm kaydı bulunamadı."}, status=404)

        result = analyze_child_measurement(
            height=record.height_field,
            weight=record.weight,
            birth_date=child.birth_date,
            measurement_datetime=record.measurement_datetime,
            gender=child.gender_name
        )
        return Response(result)

    except Child.DoesNotExist:
        return Response({"error": "Çocuk bulunamadı."}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def meal_recommendation(request, child_id):
    recommendation = generate_meal_recommendation(child_id)
    return Response({"recommendation": recommendation})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def predict_writing(request, child_id):
    if not child_id:
        return Response({'error': 'child_id parametresi gerekli'}, status=400)

    try:
        prediction_result = predict_child_writing_ability(int(child_id))
        return Response(prediction_result)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
