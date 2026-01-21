import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Activity, Droplets, Scale } from 'lucide-react';

const SYMPTOMS = [
  'Chest pain',
  'Shortness of breath',
  'Dizziness',
  'Fatigue',
  'Headaches',
  'Numbness',
  'Vision changes',
  'Irregular heartbeat',
];

export function HealthQuestionnaireForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    hypertension: '',
    diabetes: '',
    heartbeatFeeling: '',
    cholesterol: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    symptoms: [] as string[],
    notes: '',
  });

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  const calculateRiskScore = () => {
    let score = 0;
    const age = parseInt(formData.age) || 0;

    // Age factor
    if (age > 65) score += 25;
    else if (age > 50) score += 15;
    else if (age > 40) score += 10;

    // Hypertension factor (qualitative)
    if (formData.hypertension === 'yes') score += 25;
    else if (formData.hypertension === 'suspected') score += 12;

    // Diabetes factor (qualitative)
    if (formData.diabetes === 'type1' || formData.diabetes === 'type2') score += 25;
    else if (formData.diabetes === 'prediabetic') score += 12;
    else if (formData.diabetes === 'unsure') score += 5;

    // Heartbeat feeling factor (qualitative)
    if (formData.heartbeatFeeling === 'irregular') score += 20;
    else if (formData.heartbeatFeeling === 'fast') score += 15;
    else if (formData.heartbeatFeeling === 'slow') score += 10;
    else if (formData.heartbeatFeeling === 'unsure') score += 5;

    // Cholesterol factor (still qualitative - high cholesterol awareness)
    if (formData.cholesterol === 'high') score += 20;
    else if (formData.cholesterol === 'borderline') score += 10;

    // Smoking factor
    if (formData.smokingStatus === 'current') score += 20;
    else if (formData.smokingStatus === 'former') score += 5;

    // Exercise factor (reduces risk)
    if (formData.exerciseFrequency === 'never') score += 10;
    else if (formData.exerciseFrequency === 'rarely') score += 5;
    else if (formData.exerciseFrequency === 'daily') score -= 10;

    // Symptoms factor
    score += formData.symptoms.length * 5;

    return Math.min(100, Math.max(0, score));
  };

  const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
    if (score <= 25) return 'low';
    if (score <= 50) return 'moderate';
    if (score <= 75) return 'high';
    return 'critical';
  };

  const getRecommendations = (level: string): string[] => {
    const recommendations: Record<string, string[]> = {
      low: [
        'Continue maintaining a healthy lifestyle',
        'Schedule annual health checkups',
        'Stay physically active',
      ],
      moderate: [
        'Consider scheduling a consultation with a healthcare provider',
        'Monitor your blood pressure regularly',
        'Improve diet and increase physical activity',
        'Reduce stress through relaxation techniques',
      ],
      high: [
        'Schedule an appointment with a doctor soon',
        'Monitor your vital signs daily',
        'Make immediate lifestyle changes',
        'Consider medication consultation',
        'Avoid smoking and limit alcohol',
      ],
      critical: [
        'Seek immediate medical attention',
        'Contact your healthcare provider urgently',
        'Monitor symptoms closely',
        'Have someone available to assist if needed',
        'Keep emergency contacts readily available',
      ],
    };
    return recommendations[level] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Save health metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user.id,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          blood_pressure_systolic: null,
          blood_pressure_diastolic: null,
          heart_rate: null,
          blood_sugar: null,
          cholesterol: null,
          smoking_status: formData.smokingStatus || null,
          alcohol_consumption: formData.alcoholConsumption || null,
          exercise_frequency: formData.exerciseFrequency || null,
          symptoms: formData.symptoms.length > 0 ? formData.symptoms : null,
          notes: `Hypertension: ${formData.hypertension || 'not specified'}, Diabetes: ${formData.diabetes || 'not specified'}, Heartbeat: ${formData.heartbeatFeeling || 'not specified'}, Cholesterol: ${formData.cholesterol || 'not specified'}. ${formData.notes || ''}`.trim(),
        })
        .select()
        .single();

      if (metricsError) throw metricsError;

      // Calculate and save risk score
      const overallScore = calculateRiskScore();
      const riskLevel = getRiskLevel(overallScore);
      const recommendations = getRecommendations(riskLevel);

      const { error: riskError } = await supabase.from('risk_scores').insert({
        user_id: user.id,
        health_metric_id: metricsData.id,
        overall_score: overallScore,
        risk_level: riskLevel,
        cardiac_risk: Math.min(100, overallScore * 1.1),
        diabetes_risk: Math.min(100, overallScore * 0.9),
        stroke_risk: Math.min(100, overallScore * 0.85),
        recommendations,
        analysis_notes: `Assessment completed on ${new Date().toLocaleDateString()}. ${formData.symptoms.length} symptoms reported.`,
      });

      if (riskError) throw riskError;

      toast({
        title: 'Assessment Complete',
        description: 'Your health assessment has been saved. View your results on the dashboard.',
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save assessment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Basic Information</CardTitle>
              <CardDescription>Your age and body measurements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="35"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              placeholder="175"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Vital Signs</CardTitle>
              <CardDescription>Your health conditions and how you're feeling</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="hypertension">Do you have diagnosed high blood pressure (Hypertension)?</Label>
            <Select
              value={formData.hypertension}
              onValueChange={(value) => setFormData({ ...formData, hypertension: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="yes">Yes (diagnosed)</SelectItem>
                <SelectItem value="suspected">Suspected / Not sure</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diabetes">Do you have diabetes?</Label>
            <Select
              value={formData.diabetes}
              onValueChange={(value) => setFormData({ ...formData, diabetes: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="type1">Type 1 diabetic</SelectItem>
                <SelectItem value="type2">Type 2 diabetic</SelectItem>
                <SelectItem value="prediabetic">Prediabetic</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartbeat">How does your heartbeat feel right now?</Label>
            <Select
              value={formData.heartbeatFeeling}
              onValueChange={(value) => setFormData({ ...formData, heartbeatFeeling: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast / Palpitations</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cholesterol">Do you have high cholesterol?</Label>
            <Select
              value={formData.cholesterol}
              onValueChange={(value) => setFormData({ ...formData, cholesterol: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="high">Yes (diagnosed)</SelectItem>
                <SelectItem value="borderline">Borderline / Suspected</SelectItem>
                <SelectItem value="normal">No / Normal</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Lifestyle</CardTitle>
              <CardDescription>Your lifestyle habits and activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="smoking">Smoking Status</Label>
            <Select
              value={formData.smokingStatus}
              onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="never">Never smoked</SelectItem>
                <SelectItem value="former">Former smoker</SelectItem>
                <SelectItem value="current">Current smoker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alcohol">Alcohol Consumption</Label>
            <Select
              value={formData.alcoholConsumption}
              onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise Frequency</Label>
            <Select
              value={formData.exerciseFrequency}
              onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Symptoms */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Current Symptoms</CardTitle>
              <CardDescription>Select any symptoms you're currently experiencing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SYMPTOMS.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={formData.symptoms.includes(symptom)}
                  onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                />
                <Label htmlFor={symptom} className="text-sm font-normal cursor-pointer">
                  {symptom}
                </Label>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional health concerns or information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="bg-gradient-primary hover:opacity-90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Complete Assessment'
          )}
        </Button>
      </div>
    </form>
  );
}