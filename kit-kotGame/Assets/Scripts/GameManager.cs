using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using TMPro;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public int score = 0;
    public int coinsCollected = 0;
    public TextMeshProUGUI scoreText;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void AddCoin()
    {
        coinsCollected++;
        score += 10;

        // ��������� ����� �� ������
        if (scoreText != null)
        {
            scoreText.text = "Score: " + score;
        }

        Debug.Log($"�����: {coinsCollected}, ����: {score}");
    }
    // ���� ����� ���������� ��� ������� �� ������ "���������"
    public void SaveResults()
    {
        StartCoroutine(SendResultsToServer());
    }

    IEnumerator SendResultsToServer()
    {
        // ��������: ������ ���� ���� ����� �� �������� ��� ����� � ��������� Unity
        string testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzk0NjY4MjIzLCJleHAiOjE3OTUyNzMwMjN9.Aby1AzKDAvcHXjEqEaCAhxaB1cV6FjJeDkN_UZl3ahs";

        if (string.IsNullOrEmpty(testToken))
        {
            Debug.LogWarning("��� ������! ���������� ��������. ������ ����� � ������.");
            yield break;
        }

        string url = "http://localhost:3000/api/sessions";
        string json = $"{{\"score\": {score}, \"coins_collected\": {coinsCollected}}}";

        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();

        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("Authorization", "Bearer " + testToken);

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("��������� ��������: " + request.downloadHandler.text);
        }
        else
        {
            Debug.LogError("������ ��������: " + request.error);
        }
    }
}