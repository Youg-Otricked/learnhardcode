using System;
namespace Chronoshard.Core
{
    class Program
    {
        public static int Main(string[] args)
        {
            double BaseDamage = 40.0;
            double DamageMultiplier = 1.5;
            double FinalDamage = BaseDamage * DamageMultiplier;
            FinalDamage += 10.0;
            Console.WriteLine($"Final damage: {FinalDamage}");

            return 0;
        }
    }
}