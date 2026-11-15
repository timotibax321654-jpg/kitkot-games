using UnityEngine;
using UnityEngine.SocialPlatforms.Impl;

public class Coin : MonoBehaviour
{
    void OnTriggerEnter2D(Collider2D other)
    {
        // Проверяем, что в монетку врезался именно Игрок (по тегу)
        if (other.CompareTag("Player"))
        {
            // Вызываем метод добавления очка из нашего будущего GameManager
            GameManager.Instance.AddCoin();

            // Уничтожаем монетку на сцене
            Destroy(gameObject);
        }
    }

}